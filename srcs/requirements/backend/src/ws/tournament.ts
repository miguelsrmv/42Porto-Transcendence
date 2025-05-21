import { randomUUID } from 'crypto';
import { GameSession } from './gameSession';
import { gameType, leanGameSettings } from './remoteGameApp/settings';
import { GameSessionSerializable, ServerMessage } from './remoteGameApp/types';
import WebSocket from 'ws';
import { prisma } from '../utils/prisma';
import { gameTypeToGameMode } from '../utils/helpers';
import { updateLeaderboardTournament } from '../api/services/leaderboard.services';

const NBR_PARTICIPANTS = 8;
const NBR_SESSIONS_FIRST_ROUND = NBR_PARTICIPANTS / 2;

export enum tournamentState {
  creating,
  full,
  ongoing,
  ended,
}

export class Tournament {
  sessions: GameSession[] = [];
  state: tournamentState = tournamentState.creating;
  type: gameType;
  id: string = randomUUID();
  currentRound: number = 1;

  constructor(type: gameType) {
    this.type = type;
  }

  async createSession(ws: WebSocket, playerSettings: leanGameSettings) {
    const newSession = new GameSession(ws, playerSettings);
    newSession.tournament = this;
    await newSession.updateAvatar1(playerSettings.playerID);

    // For testing purposes
    const serializableSession: GameSessionSerializable = {
      players: [...newSession.players.values()], // only the IDs
      settings: newSession.settings,
    };
    console.log(
      `New ${playerSettings.gameType} GameSession created: `,
      JSON.stringify(serializableSession),
    );
    this.sessions.push(newSession);
  }

  async attributePlayerToSession(ws: WebSocket, playerSettings: leanGameSettings) {
    for (const session of this.sessions) {
      if (session.players.size === 1) {
        session.players.set(ws, playerSettings.playerID);
        await session.mergePlayer2IntoGameSettings(playerSettings);

        // For testing purposes
        const serializableSession: GameSessionSerializable = {
          players: [...session.players.values()], // only the IDs
          settings: session.settings,
        };

        console.log(
          `Player matched to a ${playerSettings.gameType} GameSession: `,
          JSON.stringify(serializableSession),
        );
      } else this.createSession(ws, playerSettings);
    }
  }

  getPlayerSession(ws: WebSocket) {
    return this.sessions.find((session) => session.players.get(ws));
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
      const message: ServerMessage = { type: 'game_setup', settings: session.settings };
      session.broadcastMessage(JSON.stringify(message));
    }
  }

  getAllPlayerIds(): string[] {
    // NOTE: Set removes any duplicates
    const ids = new Set<string>(this.sessions.flatMap((session) => session.getPlayers()));
    return Array.from(ids);
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
    await updateLeaderboardTournament(winner, this.currentRound);

    const roundSessions = this.sessions.filter((session) => session.round === this.currentRound);
    if (roundSessions.every((session) => session.winner)) this.advanceRound();
  }

  advanceRound() {
    const winners = this.sessions
      .filter((session) => session.round === this.currentRound)
      .map((s) => s.winner)
      .filter((winner): winner is string => !!winner);

    if (winners.length <= 1) {
      this.state = tournamentState.ended;
      // TODO: send message to all players
      // this.broadcastToAll('Tournament has ended');
    }
    ++this.currentRound;
  }
}
