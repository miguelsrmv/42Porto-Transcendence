import WebSocket from 'ws';
import { gameType, leanGameSettings } from './remoteGameApp/settings';
import { GameSession } from './gameSession';
import { removeItem } from './helpers';

export class GameSessionManager {
  private sessions: Map<gameType, GameSession[]> = new Map();
  private playerSessions: Map<string, GameSession> = new Map();

  constructor() {
    this.sessions.set('Classic Pong', []);
    this.sessions.set('Crazy Pong', []);
  }

  private getSessions(type: gameType): GameSession[] {
    return this.sessions.get(type)!;
  }

  public getSessionByPlayerId(playerId: string) {
    return this.playerSessions.get(playerId);
  }

  public isPlayerInSession(playerId: string): boolean {
    return this.playerSessions.get(playerId) !== undefined;
  }

  public async attributePlayerToSession(ws: WebSocket, settings: leanGameSettings) {
    const { playerID } = settings;
    if (!(await this.foundSession(ws, settings))) {
      await this.createSession(ws, settings);
    }
    const session = this.getSessionByPlayerId(playerID)!;
    if (session.isFull()) await session.startGame();
  }

  private async foundSession(ws: WebSocket, settings: leanGameSettings): Promise<boolean> {
    const sessions = this.getSessions(settings.gameType);
    for (const session of sessions) {
      if (session.aliases.some((a) => a === settings.alias))
        settings.alias = settings.alias.concat('1');
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

  public async removePlayerSessionManager(playerId: string) {
    const session = this.getSessionByPlayerId(playerId);
    if (!session) return;
    await session.removePlayerSession(playerId);
    await session.clear();
    this.playerSessions.delete(playerId);
    if (session.players.length === 0) {
      this.removeSession(session);
    }
  }

  public removeSession(session: GameSession) {
    const sessions = this.getSessions(session.gameType);
    removeItem(sessions, session);
  }
}
