import WebSocket from 'ws';
import { gameSettings, leanGameSettings, playType } from './remoteGameApp/settings';
import { GameArea } from './remoteGameApp/gameArea';
import {
  DEFAULT_AVATAR_PATH,
  getAvatarFromPlayer,
  getRandomBackground,
} from './remoteGameApp/sessionManagement';
import { Tournament } from './tournament';

export class GameSession {
  type: playType;
  players: Map<WebSocket, string> = new Map();
  winner?: string;
  round: number = 1;
  settings: gameSettings;
  gameArea: GameArea | null = null;
  tournament?: Tournament;

  // TODO: Review placeholders
  constructor(ws: WebSocket, player1settings: leanGameSettings) {
    this.type = player1settings.playType;
    this.settings = {
      playType: player1settings.playType,
      gameType: player1settings.gameType,
      alias1: player1settings.alias,
      alias2: 'player2',
      avatar1: DEFAULT_AVATAR_PATH,
      avatar2: DEFAULT_AVATAR_PATH,
      paddleColour1: player1settings.paddleColour,
      paddleColour2: '#ff0000',
      character1: player1settings.character,
      character2: player1settings.character,
      background: getRandomBackground(),
    };
    this.players.set(ws, player1settings.playerID);
  }

  isFull(): boolean {
    return this.players.size === 2;
  }

  isEmpty(): boolean {
    return this.players.size === 0;
  }

  getPlayers() {
    const iterator = this.players.values();
    const playerIds = [];
    for (const value of iterator) {
      playerIds.push(value);
    }
    return playerIds;
  }

  async mergePlayer2IntoGameSettings(playerSettings: leanGameSettings) {
    if (!this.settings) return;
    this.settings.alias2 = playerSettings.alias;
    this.settings.avatar2 =
      (await getAvatarFromPlayer(playerSettings.playerID)) || DEFAULT_AVATAR_PATH;
    this.settings.paddleColour2 = playerSettings.paddleColour;
    this.settings.character2 = playerSettings.character;
  }

  async updateAvatar1(playerId: string) {
    this.settings.avatar1 = (await getAvatarFromPlayer(playerId)) || DEFAULT_AVATAR_PATH;
  }

  broadcastMessage(message: string) {
    for (const socket of this.players.keys()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    }
  }
}
