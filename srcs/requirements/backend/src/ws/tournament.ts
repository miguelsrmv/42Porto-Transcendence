import { randomUUID } from 'crypto';
import { GameSession, PlayerInfo } from './gameSession';
import { gameType, playerSettings } from './remoteGameApp/settings';
import { PlayerTuple, ServerMessage } from './remoteGameApp/types';
import WebSocket from 'ws';
import { prisma } from '../utils/prisma';
import { gameTypeToEnum, gameTypeToGameMode } from '../utils/helpers';
import { updateLeaderboardTournament } from '../api/services/leaderboard.services';
import {
  contractSigner,
  wallet,
  provider,
  contractProvider,
} from '../api/services/blockchain.services';
import { closeSocket, playerInfoToTournamentPlayer, removeItem, wait } from './helpers';
import { Mutex } from 'async-mutex';
import { getAvatarFromPlayer } from '../api/services/user.services';

const NBR_PARTICIPANTS = 8;
const WAITING_TIME = 5;

const blockchainMutex = new Mutex();

export enum tournamentState {
  creating = 'creating',
  ongoing = 'ongoing',
  ended = 'ended',
}

export interface BlockchainScoreData {
  tournamentId: string;
  gameType: number;
  player1Data: PlayerTuple;
  score1: number;
  player2Data: PlayerTuple;
  score2: number;
}

export class Tournament {
  sessions: GameSession[] = [];
  state: tournamentState = tournamentState.creating;
  type: gameType;
  id: string = randomUUID();
  currentRound: number = 1;
  players: PlayerInfo[] = [];
  roundWinners: PlayerInfo[] = [];
  roundStarting: boolean = false;
  aliases: string[] = [];

  constructor(type: gameType) {
    this.type = type;
  }

  public hasAlias(alias: string): boolean {
    return this.aliases.some((a) => a === alias);
  }

  public getPlayerInfo(id: string) {
    return this.players.find((p) => p.id === id);
  }

  public getPlayerSession(playerId: string) {
    return this.sessions
      .filter((s) => s.round === this.currentRound)
      .find((session) => session.players.some((p) => p.id === playerId));
  }

  private async clear() {
    console.log('Clearing tournament');
    this.state = tournamentState.ended;
    await Promise.all(this.sessions.map((session) => session.clear()));
    this.sessions.length = 0;
    this.players.length = 0;
    this.roundWinners.length = 0;
  }

  public isFull() {
    return this.players.length === NBR_PARTICIPANTS;
  }

  private getAllPlayerIds(): string[] {
    return this.players.flatMap((p) => p.id);
  }

  private resetReadyForNextRound() {
    this.players.forEach((p) => (p.readyForNextRound = false));
  }

  public async setPlayer(ws: WebSocket, playerSettings: playerSettings) {
    this.players.push(
      new PlayerInfo(
        playerSettings.playerID,
        ws,
        playerSettings.alias,
        await getAvatarFromPlayer(playerSettings.playerID),
        playerSettings.paddleColour,
        playerSettings.character,
      ),
    );
    this.aliases.push(playerSettings.alias);
  }

  async start() {
    this.state = tournamentState.ongoing;
    this.createRoundSessions(this.players);
    const firstRoundSessions = this.sessions;
    this.broadcastStatus(this.players);
    const data = this.getTournamentCreateData();
    console.log(`Starting tournament: ${JSON.stringify(data)}`);
    const release = await blockchainMutex.acquire();
    try {
      const currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
      const tx = await contractSigner.joinTournament(
        data.tournamentId,
        data.gameType,
        data.participants,
        {
          nonce: currentNonce,
        },
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error in joinTournament Blockchain call: ${err}`);
    } finally {
      release();
    }
    await this.addTournamentToDB(this.id, this.type, this.getAllPlayerIds());
    await wait(WAITING_TIME);
    for (const session of firstRoundSessions) void session.startGame();
  }

  private async addTournamentToDB(tournamentId: string, gameType: gameType, playerIds: string[]) {
    await Promise.all(
      playerIds.map((id) =>
        prisma.tournamentParticipant.create({
          data: {
            tournamentId: tournamentId,
            userId: id,
            tournamentType: gameTypeToGameMode(gameType),
          },
        }),
      ),
    );
  }

  public async updateSessionScore(round: number, winner: string, data: BlockchainScoreData) {
    await updateLeaderboardTournament(winner, round);
    this.setPlayerScore(data.player1Data[0], data.score1);
    this.setPlayerScore(data.player2Data[0], data.score2);
    const release = await blockchainMutex.acquire();
    try {
      const currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
      const tx = await contractSigner.saveScoreAndAddWinner(
        data.tournamentId,
        data.player1Data,
        data.score1,
        data.player2Data,
        data.score2,
        {
          nonce: currentNonce,
        },
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error calling saveScoreAndAddWinner: ${err}`);
    } finally {
      release();
    }
    await this.checkAllSessionsWinner();
  }

  private async checkAllSessionsWinner() {
    if (this.state === tournamentState.ended) return;
    const roundSessions = this.sessions.filter((session) => session.round === this.currentRound);
    if (roundSessions.every((session) => session.winner)) await this.advanceRound();
  }

  private setPlayerScore(playerId: string, score: number) {
    const player = this.getPlayerInfoFromId(playerId);
    if (!player) return;
    console.log(`Setting score ${score} for ${player.alias} in round ${this.currentRound}`);
    switch (this.currentRound) {
      case 1: {
        player.scoreQuarterFinals = score;
        break;
      }
      case 2: {
        player.scoreSemiFinals = score;
        break;
      }
      case 3: {
        player.scoreFinals = score;
        break;
      }
    }
  }

  private async advanceRound() {
    this.roundWinners = this.determineRoundWinners();
    console.log(`Round winners: ${this.roundWinners.map((w) => w.alias)}`);
    const availableWinners = this.roundWinners.filter((p) => !p.isDisconnected);
    if (this.currentRound === 3 && availableWinners.length === 1) {
      closeSocket(this.roundWinners[0].socket);
    }
    if (this.roundWinners.length <= 1) {
      console.log('Tournament has ended');
      await this.clear();
      return;
    }
    await this.checkIfAllWinnersReady();
  }

  private determineRoundWinners() {
    return this.sessions
      .filter((session) => session.round === this.currentRound)
      .filter((s) => s.winner)
      .map((s) => this.getPlayerInfoFromId(s.winner!))
      .filter((w): w is PlayerInfo => !!w);
  }

  public async setReadyForNextRound(ws: WebSocket) {
    const player = this.players.find((p) => p.socket === ws);
    if (player && !player.readyForNextRound) player.readyForNextRound = true;
    if (!this.roundWinners || this.roundWinners.length === 0) return;

    await this.checkIfAllWinnersReady();
  }

  private async checkIfAllWinnersReady() {
    if (!this.roundWinners || this.roundWinners.length === 0 || this.roundStarting) return;
    const availableWinners = this.roundWinners.filter((p) => !p.isDisconnected);
    availableWinners.forEach((w) => console.log(`Available round winner: ${w.alias}`));
    const allReady = availableWinners.every((winner) => {
      const player = this.players.find((p) => p.id === winner.id);
      if (!player) return false;
      return player.readyForNextRound;
    });

    if (allReady && !this.roundStarting) {
      console.log('All winners ready');
      this.roundStarting = true;
      try {
        await this.startRound();
      } finally {
        this.roundStarting = false;
      }
    }
  }

  private async clearPreviousRoundSessions() {
    console.log(`Clearing previous round sessions`);
    const previousSessions = this.sessions.filter((s) => s.round === this.currentRound - 1);
    for (const session of previousSessions) await session.clear();
  }

  private async startRound() {
    const availableWinners = this.roundWinners.filter((p) => !p.isDisconnected);
    this.broadcastStatus(availableWinners);
    this.resetReadyForNextRound();
    ++this.currentRound;
    console.log(`Advancing to round ${this.currentRound}`);
    this.createRoundSessions(this.roundWinners);
    const nextRoundSessions = this.sessions;
    this.roundWinners.length = 0;
    await this.clearPreviousRoundSessions();
    if (this.currentRound > 1)
      console.log(`Blockchain array: ${await contractProvider.getMatchedParticipants(this.id)}`);
    await wait(WAITING_TIME);
    const sessionsToStart = nextRoundSessions.filter(
      (session) => session.round === this.currentRound && !session.winner,
    );
    for (const session of sessionsToStart) void session.startGame();
  }

  private broadcastStatus(players: PlayerInfo[]) {
    const playersStats = playerInfoToTournamentPlayer(this.players);
    const message: ServerMessage = { type: 'tournament_status', participants: playersStats };
    for (const player of players) {
      if (player.socket.readyState === WebSocket.OPEN) player.socket.send(JSON.stringify(message));
    }
  }

  private createRoundSessions(players: PlayerInfo[]) {
    console.log(`Creating new round session with: ${players.map((p) => p.alias)}`);
    for (let i = 0; i < players.length; i += 2) {
      const player1 = players[i];
      const player2 = players[i + 1];

      const newSession = new GameSession(this.type, 'Remote Tournament Play');
      newSession.players.push(player1);
      newSession.players.push(player2);
      newSession.round = this.currentRound;
      newSession.tournament = this;
      this.sessions.push(newSession);
    }
  }

  private getPlayerInfoFromId(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  public async removePlayerTournament(playerId: string) {
    const player = this.getPlayerInfo(playerId);
    if (!player) return;
    console.log(`Removing ${player.alias} from a tournament`);
    if (this.state === tournamentState.creating || this.state === tournamentState.ended) {
      removeItem(this.players, player);
      removeItem(this.aliases, player.alias);
      return;
    }
    player.isDisconnected = true;
    player.lastConnectedAt = Date.now();
    const winner = this.roundWinners.find((w) => w.id === playerId);
    if (winner) winner.isDisconnected = true;
    const playerSession = this.sessions
      .filter((s) => s.round === this.currentRound)
      .find((s) => s.playerIsInSession(playerId));
    if (!playerSession) return;
    await playerSession.markAsDisconnected(playerId);
    await this.checkIfAllWinnersReady();
  }

  private getTournamentCreateData() {
    const playersData: PlayerTuple[] = this.players.map((p): PlayerTuple => {
      return [p.id, p.alias, p.character?.name ?? 'NONE'];
    });
    return {
      tournamentId: this.id,
      gameType: gameTypeToEnum(this.type),
      participants: playersData,
    };
  }

  public print() {
    return {
      sessions: this.sessions.map((s) => s.players.map((p) => p.alias)),
      state: this.state,
      type: this.type,
      id: this.id,
      currentRound: this.currentRound,
      players: this.players.map((p) => p.alias),
    };
  }
}
