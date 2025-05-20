import { randomUUID } from 'crypto';
import { GameSession } from './gameSession';
import { gameType, leanGameSettings } from './remoteGameApp/settings';
import { GameSessionSerializable, ServerMessage } from './remoteGameApp/types';
import WebSocket from 'ws';

const NBR_PARTICIPANTS = 8;

export enum tournamentState {
  creating,
  full,
  ongoing,
  ended,
}

export class Tournament {
  sessions: GameSession[];
  state: tournamentState;
  type: gameType;
  id: string;

  constructor(type: gameType) {
    this.state = tournamentState.creating;
    this.sessions = [];
    this.type = type;
    this.id = randomUUID();
  }

  async createSession(ws: WebSocket, playerSettings: leanGameSettings) {
    const newSession = new GameSession(ws, playerSettings);
    newSession.tournamentId = this.id;
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
    const availableSession = this.sessions.find((session) => !session.isFull());
    return availableSession === undefined && this.sessions.length === NBR_PARTICIPANTS;
  }

  isEmpty() {
    const availableSession = this.sessions.find((session) => !session.isEmpty());
    return this.sessions.length === 0 || !availableSession;
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

  getAllPlayerIds() {
    const playerIds = this.sessions.map((session) => {
      return session.getPlayers();
    });
    return playerIds.flat();
  }

  async addTournamentToDB(id: string, gameType: gameType, playerIds: string[]) {
    // TODO: add logic to create tournamentParticipant with the data
  }
}
