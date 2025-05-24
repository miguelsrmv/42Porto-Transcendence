import WebSocket from 'ws';
import { gameType, leanGameSettings } from './remoteGameApp/settings';
import { GameSession } from './gameSession';

export class GameSessionManager {
  private sessions: Map<gameType, GameSession[]> = new Map();
  private playerSockets: Map<string, WebSocket> = new Map();
  private socketToPlayerId: Map<WebSocket, string> = new Map();
  private playerSessions: Map<string, GameSession> = new Map();

  constructor() {
    this.sessions.set('Classic Pong', []);
    this.sessions.set('Crazy Pong', []);
  }

  private getSessions(type: gameType): GameSession[] {
    return this.sessions.get(type)!;
  }

  private getSessionByPlayerId(playerId: string): GameSession {
    return this.playerSessions.get(playerId)!;
  }

  public isPlayerInSession(playerId: string): boolean {
    return this.playerSessions.get(playerId) !== undefined;
  }

  public async attributePlayerToSession(ws: WebSocket, settings: leanGameSettings) {
    const { playerID } = settings;
    this.playerSockets.set(playerID, ws);
    this.socketToPlayerId.set(ws, playerID);
    if (!(await this.foundSession(ws, settings))) {
      await this.createSession(ws, settings);
    }
    const session = this.getSessionByPlayerId(playerID);
    if (session.isFull()) session.startGame();
  }

  private async foundSession(ws: WebSocket, settings: leanGameSettings): Promise<boolean> {
    const sessions = this.getSessions(settings.gameType);
    for (const session of sessions) {
      if (session.players.length === 1) {
        this.playerSessions.set(settings.playerID, session);
        await session.setPlayer(ws, settings);
        console.log(
          `Player matched to a ${settings.gameType} GameSession: `,
          JSON.stringify(session.print()),
        );
        return true;
      }
    }
    return false;
  }

  private async createSession(ws: WebSocket, settings: leanGameSettings) {
    const newSession = new GameSession(settings.gameType, settings.playType);
    this.playerSessions.set(settings.playerID, newSession);
    await newSession.setPlayer(ws, settings);
    this.getSessions(settings.gameType).push(newSession);
    console.log(
      `New ${settings.gameType} GameSession created: `,
      JSON.stringify(newSession.print()),
    );
  }

  public getSessionBySocket(ws: WebSocket): GameSession | undefined {
    const playerId = this.socketToPlayerId.get(ws);
    if (!playerId) return;
    return this.playerSessions.get(playerId);
  }

  public async removePlayerBySocket(ws: WebSocket) {
    const playerId = this.socketToPlayerId.get(ws);
    if (!playerId) return;
    const session = this.getSessionByPlayerId(playerId);
    if (!session) return;
    await session.removePlayer(ws);
    this.cleanupPlayer(playerId, ws);
    if (session.players.length === 0) {
      this.removeSession(session);
    }
  }

  private cleanupPlayer(playerId: string, ws: WebSocket) {
    this.playerSessions.delete(playerId);
    this.playerSockets.delete(playerId);
    this.socketToPlayerId.delete(ws);
  }

  public removeSession(session: GameSession) {
    const sessions = this.getSessions(session.gameType);
    const index = sessions.indexOf(session);
    if (index !== -1) sessions.splice(index, 1);
  }
}
