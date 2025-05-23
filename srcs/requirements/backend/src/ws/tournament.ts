import { randomUUID } from 'crypto';
import { GameSession, PlayerInfo } from './gameSession';
import { gameType, leanGameSettings, playerSettings } from './remoteGameApp/settings';
import { ServerMessage } from './remoteGameApp/types';
import WebSocket from 'ws';
import { prisma } from '../utils/prisma';
import { gameTypeToGameMode } from '../utils/helpers';
import { updateLeaderboardTournament } from '../api/services/leaderboard.services';
import { contractSigner } from '../api/services/blockchain.services';

const NBR_PARTICIPANTS = 8;
const NBR_SESSIONS_FIRST_ROUND = NBR_PARTICIPANTS / 2;

export enum tournamentState {
  creating,
  full,
  ongoing,
  ended,
}

// NOTE: playerID, playType and gameType not needed (new type?)
export function playerInfoToPlayerSettings(player: PlayerInfo): playerSettings {
  return {
    playerID: player.id,
    alias: player.alias,
    character: player.character,
    paddleColour: player.paddleColour,
  };
}

export class Tournament {
  sessions: GameSession[] = [];
  state: tournamentState = tournamentState.creating;
  type: gameType;
  id: string = randomUUID();
  currentRound: number = 1;
  players: PlayerInfo[] = [];

  constructor(type: gameType) {
    this.type = type;
  }

  async createSession(ws: WebSocket, playerSettings: leanGameSettings) {
    const newSession = new GameSession(playerSettings.gameType, playerSettings.playType);
    newSession.tournament = this;
    await newSession.setPlayer(ws, playerSettings);

    console.log(`New ${playerSettings.gameType} GameSession created: `, JSON.stringify(newSession));
    this.sessions.push(newSession);
  }

  async attributePlayerToSession(ws: WebSocket, playerSettings: leanGameSettings) {
    for (const session of this.sessions) {
      if (session.players.length === 1) {
        await session.setPlayer(ws, playerSettings);

        console.log(
          `Player matched to a ${playerSettings.gameType} GameSession: `,
          JSON.stringify(session),
        );
      } else this.createSession(ws, playerSettings);
    }
  }

  setPlayersTournamentStart() {
    this.players = this.getAllPlayers();
  }

  getPlayerSession(ws: WebSocket) {
    return this.sessions.find((session) => session.players.some((p) => p.socket === ws));
  }

  clear() {
    this.sessions.forEach((session) => session.clear());
    this.sessions.length = 0;
    this.players.forEach((player) => this.removePlayer(player.socket));
    this.players.length = 0;
  }

  isFull() {
    return (
      this.sessions.length === NBR_SESSIONS_FIRST_ROUND &&
      this.sessions.every((session) => session.isFull())
    );
  }

  isEmpty() {
    return this.sessions.length === 0 || this.sessions.every((session) => session.isEmpty());
  }

  broadcastToAll(message: string) {
    for (const session of this.sessions) session.broadcastMessage(message);
  }

  broadcastSettingsToSessions() {
    for (const session of this.sessions) {
      const message: ServerMessage = { type: 'game_setup', settings: session.getJointSettings() };
      session.broadcastMessage(JSON.stringify(message));
    }
  }

  getAllPlayerIds(): string[] {
    // NOTE: Set removes any duplicates
    const ids = new Set<string>(this.sessions.flatMap((session) => session.getPlayerIds()));
    return Array.from(ids);
  }

  getAllPlayers() {
    const ids = new Set<PlayerInfo>(this.sessions.flatMap((session) => session.getPlayers()));
    return Array.from(ids);
  }

  async start() {
    this.state = tournamentState.ongoing;
    const data = this.getTournamentCreateData();
    const tx = await contractSigner.joinTournament(
      data.tournamentId,
      data.gameType,
      data.participants,
    );
    await tx.wait();
    await this.addTournamentToDB(this.id, this.type, this.getAllPlayerIds());
    this.broadcastSettingsToSessions();
    this.sessions.forEach((session) => session.startGame());
    const gameStartMsg: ServerMessage = { type: 'game_start' };
    // TODO: Add tournament tree info
    this.broadcastToAll(JSON.stringify(gameStartMsg));
  }

  async addTournamentToDB(tournamentId: string, gameType: gameType, playerIds: string[]) {
    // TODO: Check for repeated alias
    playerIds.forEach(async (id) => {
      await prisma.tournamentParticipant.create({
        data: {
          tournamentId: tournamentId,
          userId: id,
          tournamentType: gameTypeToGameMode(gameType),
        },
      });
    });
  }

  async updateSessionScore(sessionToUpdate: GameSession, winner: string) {
    if (sessionToUpdate.winner) return;
    sessionToUpdate.winner = winner;
    await updateLeaderboardTournament(winner, sessionToUpdate.round);

    const roundSessions = this.sessions.filter((session) => session.round === this.currentRound);
    if (roundSessions.every((session) => session.winner)) await this.advanceRound();
  }

  async advanceRound() {
    const winners = this.sessions
      .filter((session) => session.round === this.currentRound)
      .map((s) => s.winner)
      .filter((winner): winner is string => !!winner);

    if (winners.length <= 1) {
      this.state = tournamentState.ended;
      // TODO: send message to all players
      this.broadcastToAll(JSON.stringify({ message: 'Tournament has ended' }));
      this.clear();
      return;
    }
    ++this.currentRound;
    await this.createNextRoundSessions(winners);
    // TODO: Call wait
    this.sessions
      .filter((session) => session.round === this.currentRound)
      .forEach((session) => session.startGame());
  }

  // TODO: Check matchup logic
  async createNextRoundSessions(playerIds: string[]) {
    // TODO: Advance round if winner quits before next round
    const nextRoundPlayers = playerIds
      .map((id) => this.getPlayerInfoFromId(id))
      .filter((p): p is PlayerInfo => !!p);
    for (let i = 0; i < nextRoundPlayers.length; i += 2) {
      const player1 = nextRoundPlayers[i];
      const player2 = nextRoundPlayers[i + 1];

      const newSession = new GameSession(this.type, 'Tournament Play');
      await newSession.setPlayer(player1.socket, playerInfoToPlayerSettings(player1));
      await newSession.setPlayer(player1.socket, playerInfoToPlayerSettings(player2));
      newSession.round = this.currentRound;
      this.sessions.push(newSession);
    }
  }

  getPlayerInfoFromId(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  removePlayer(socket: WebSocket) {
    this.sessions.forEach((session) => {
      session.removePlayer(socket);
    });
  }

  getTournamentCreateData() {
    const playersData = this.sessions.map((session) => {
      if (!session.gameArea) return;
      return [
        {
          userId: session.gameArea.leftPlayer.id,
          alias: session.gameArea.settings.alias1,
          character: session.gameArea.settings.character1?.name,
        },
        {
          userId: session.gameArea.rightPlayer.id,
          alias: session.gameArea.settings.alias2,
          character: session.gameArea.settings.character2?.name,
        },
      ];
    });
    return { tournamentId: this.id, gameType: this.type, participants: playersData };
  }
}
