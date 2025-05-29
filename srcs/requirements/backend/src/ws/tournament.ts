import { randomUUID } from 'crypto';
import { GameSession, PlayerInfo } from './gameSession';
import { gameType, leanGameSettings } from './remoteGameApp/settings';
import { ServerMessage } from './remoteGameApp/types';
import WebSocket from 'ws';
import { prisma } from '../utils/prisma';
import { gameTypeToEnum, gameTypeToGameMode } from '../utils/helpers';
import { updateLeaderboardTournament } from '../api/services/leaderboard.services';
import { contractSigner } from '../api/services/blockchain.services';
import { closeSocket, playerInfoToPlayerSettings, playerInfoToTournamentPlayer } from './helpers';

const NBR_PARTICIPANTS = 8;
const NBR_SESSIONS_FIRST_ROUND = NBR_PARTICIPANTS / 2;

export enum tournamentState {
  creating = 'creating',
  full = 'full',
  ongoing = 'ongoing',
  ended = 'ended',
}

export interface BlockchainScoreData {
  // TODO: change to number
  tournamentId: string;
  gameType: number;
  player1Id: string;
  score1: number;
  player2Id: string;
  score2: number;
}

export class Tournament {
  sessions: GameSession[] = [];
  state: tournamentState = tournamentState.creating;
  type: gameType;
  // TODO: Get id as nbr of tournaments on blockchain
  // id: number = 0;
  id: string = randomUUID();
  currentRound: number = 1;
  players: PlayerInfo[] = [];
  roundWinners: PlayerInfo[] = [];
  roundStarting: boolean = false;

  constructor(type: gameType) {
    this.type = type;
  }

  // TODO: Create first session on Tournament constructor
  async createSession(ws: WebSocket, playerSettings: leanGameSettings) {
    const newSession = new GameSession(this.type, 'Tournament Play');
    newSession.tournament = this;
    await newSession.setPlayer(ws, playerSettings);

    console.log(
      `New ${playerSettings.gameType} GameSession created: `,
      JSON.stringify(newSession.print()),
    );
    this.sessions.push(newSession);
  }

  public async attributePlayerToSession(ws: WebSocket, playerSettings: leanGameSettings) {
    for (const session of this.sessions) {
      if (session.players.length === 1) {
        await session.setPlayer(ws, playerSettings);

        console.log(
          `Player matched to a ${playerSettings.gameType} GameSession: `,
          JSON.stringify(session.print()),
        );
        return;
      }
    }
    await this.createSession(ws, playerSettings);
  }

  private setPlayersTournamentStart() {
    this.players = this.getAllPlayers();
  }

  public getPlayerInfo(id: string) {
    return this.players.find((p) => p.id === id);
  }

  private removeSession(session: GameSession) {
    const index = this.sessions.indexOf(session);
    if (index !== -1) this.sessions.splice(index, 1);
  }

  public getPlayerSession(ws: WebSocket) {
    return this.sessions
      .filter((s) => s.round === this.currentRound)
      .find((session) => session.players.some((p) => p.socket === ws));
  }

  private async clear() {
    console.log('Clearing tournament');
    await Promise.all(this.sessions.map((session) => session.clear()));
    this.sessions.length = 0;
    this.players.length = 0;
    this.roundWinners.length = 0;
  }

  public isFull() {
    return (
      this.sessions.length === NBR_SESSIONS_FIRST_ROUND &&
      this.sessions.every((session) => session.isFull())
    );
  }

  public broadcastToAll(message: string) {
    this.sessions
      .filter((s) => s.round === this.currentRound)
      .forEach((s) => s.broadcastMessage(message));
  }

  private broadcastToRoundWinners(message: string) {
    this.roundWinners.forEach((w) => {
      if (w.socket.readyState === WebSocket.OPEN) w.socket.send(message);
    });
  }

  private sendToPlayerCloseSocket(playerId: string, message: string) {
    const socket = this.getPlayerInfoFromId(playerId)?.socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      closeSocket(socket);
    }
  }

  public broadcastSettingsToSessions() {
    this.sessions.forEach((s) => {
      const message: ServerMessage = { type: 'game_setup', settings: s.getJointSettings() };
      s.broadcastMessage(JSON.stringify(message));
    });
  }

  private getAllPlayerIds(): string[] {
    // NOTE: Set removes any duplicates
    const ids = new Set<string>(this.sessions.flatMap((session) => session.getPlayerIds()));
    return Array.from(ids);
  }

  private getAllPlayers() {
    const ids = new Set<PlayerInfo>(this.sessions.flatMap((session) => session.getPlayers()));
    return Array.from(ids);
  }

  async start() {
    this.state = tournamentState.ongoing;
    this.setPlayersTournamentStart();
    const data = this.getTournamentCreateData();
    console.log(`Starting tournament: ${JSON.stringify(data)}`);
    try {
      const tx = await contractSigner.joinTournament(
        data.tournamentId,
        data.gameType,
        data.participants,
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error in joinTournament Blockchain call: ${err}`);
    }
    await this.addTournamentToDB(this.id, this.type, this.getAllPlayerIds());
    this.sessions.forEach((session) => session.startGame());
  }

  private async addTournamentToDB(tournamentId: string, gameType: gameType, playerIds: string[]) {
    // TODO: Check for repeated alias
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

  public async updateSessionScore(
    sessionToUpdate: GameSession,
    winner: string,
    data: BlockchainScoreData,
  ) {
    if (sessionToUpdate.winner) return;
    try {
      // TODO: Check if order of users matter
      const tx = await contractSigner.saveScoreAndAddWinner(
        data.tournamentId,
        data.gameType,
        data.player1Id,
        data.score1,
        data.player2Id,
        data.score2,
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error calling saveScoreAndAddWinner: ${err}`);
    }
    await updateLeaderboardTournament(winner, sessionToUpdate.round);
    this.setPlayerScore(data.player1Id, data.score1);
    this.setPlayerScore(data.player2Id, data.score2);
    sessionToUpdate.winner = winner;
    const roundSessions = this.sessions.filter((session) => session.round === this.currentRound);
    if (roundSessions.every((session) => session.winner)) await this.advanceRound();
  }

  private setPlayerScore(playerId: string, score: number) {
    const player = this.getPlayerInfoFromId(playerId)!;
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
    if (this.roundWinners.length <= 1) {
      console.log('Tournament has ended');
      // TODO: send winner score ?
      this.sendToPlayerCloseSocket(
        this.roundWinners[0].id,
        JSON.stringify({ type: 'tournament_end' } as ServerMessage),
      );
      this.state = tournamentState.ended;
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
    if (!this.roundWinners || this.roundStarting) return;

    const allReady = this.roundWinners.every((winner) => {
      const player = this.players.find((p) => p.id === winner.id);
      return player?.readyForNextRound;
    });

    if (allReady) {
      this.roundStarting = true;
      try {
        await this.startRound();
      } finally {
        this.roundStarting = false;
      }
    }
  }

  private async startRound() {
    ++this.currentRound;
    console.log(`Advancing to round ${this.currentRound}`);
    await this.createNextRoundSessions();
    this.sendTournamentStatus();
    this.roundWinners.length = 0;
    // await wait(10);
    this.sessions
      .filter((session) => session.round === this.currentRound)
      .forEach((session) => {
        session.startGame();
      });
  }

  private sendTournamentStatus() {
    // TODO: get data from Blockchain
    const playersStats = playerInfoToTournamentPlayer(this.players);
    const message: ServerMessage = { type: 'tournament_status', participants: playersStats };
    this.broadcastToRoundWinners(JSON.stringify(message));
  }

  // TODO: Check matchup logic
  private async createNextRoundSessions() {
    // TODO: Advance round if winner quits before next round
    console.log(`Creating new round session with: ${this.roundWinners.map((p) => p.alias)}`);
    for (let i = 0; i < this.roundWinners.length; i += 2) {
      const player1 = this.roundWinners[i];
      const player2 = this.roundWinners[i + 1];

      const newSession = new GameSession(this.type, 'Tournament Play');
      await newSession.setPlayer(player1.socket, playerInfoToPlayerSettings(player1));
      await newSession.setPlayer(player2.socket, playerInfoToPlayerSettings(player2));
      newSession.round = this.currentRound;
      newSession.tournament = this;
      this.sessions.push(newSession);
    }
  }

  private getPlayerInfoFromId(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  // NOTE: only removing player from session from current round
  public async removePlayer(socket: WebSocket) {
    console.log('Removing player in tournament');
    const playerSessions = this.sessions.filter((s) => s.playerIsInSession(socket));
    for (const session of playerSessions) {
      await session.removePlayer(socket);
      if (session.isEmpty()) this.removeSession(session);
    }
  }

  private getTournamentCreateData() {
    const playersData = this.players.flatMap((p) => {
      return [
        {
          userId: p.id,
          alias: p.alias,
          character: p.character?.name ?? 'NONE',
        },
      ];
    });
    return {
      tournamentId: this.id,
      gameType: gameTypeToEnum(this.type),
      participants: playersData,
    };
  }

  public print() {
    return {
      sessions: this.sessions.map((s) => s.players.map((p) => p.id)),
      state: this.state,
      type: this.type,
      id: this.id,
      currentRound: this.currentRound,
      players: this.players.map((p) => p.toJSON()),
    };
  }
}
