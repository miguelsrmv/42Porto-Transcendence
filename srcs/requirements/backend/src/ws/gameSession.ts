import WebSocket from 'ws';
import {
  character,
  gameSettings,
  gameType,
  playerSettings,
  playType,
} from './remoteGameApp/settings';
import { GameArea } from './remoteGameApp/gameArea';
import { getAvatarFromPlayer, getRandomBackground } from './sessionManagement';
import { Tournament } from './tournament';
import { Player } from './remoteGameApp/player';
import { setPowerUpBar } from './remoteGameApp/game';
import { ServerMessage } from './remoteGameApp/types';

export interface PlayerInfo {
  id: string;
  socket: WebSocket;
  alias: string;
  avatar: string;
  paddleColour: string;
  character: character | null;
}

export class GameSession {
  gameType: gameType;
  playType: playType;
  players: PlayerInfo[] = [];
  winner?: string;
  round: number = 1;
  gameArea: GameArea | null = null;
  tournament?: Tournament;

  constructor(gameType: gameType, playType: playType) {
    this.gameType = gameType;
    this.playType = playType;
  }

  async setPlayer(ws: WebSocket, playerSettings: playerSettings) {
    this.players.push({
      id: playerSettings.playerID,
      socket: ws,
      alias: playerSettings.alias,
      avatar: await getAvatarFromPlayer(playerSettings.playerID),
      paddleColour: playerSettings.paddleColour,
      character: playerSettings.character,
    });
  }

  removePlayer(ws: WebSocket) {
    const playerToRemove = this.players.find((player) => player.socket === ws);
    if (!playerToRemove) return;
    const index = this.players.indexOf(playerToRemove);
    if (index !== -1) this.players.splice(index, 1);
  }

  isFull(): boolean {
    return this.players.length === 2;
  }

  isEmpty(): boolean {
    return this.players.length === 0;
  }

  getPlayers() {
    return this.players;
  }

  getPlayerIds() {
    const ids = new Set<string>(this.players.flatMap((player) => player.id));
    return Array.from(ids);
  }

  broadcastMessage(message: string) {
    this.players.forEach((player) => {
      if (player.socket.readyState === WebSocket.OPEN) player.socket.send(message);
    });
  }

  broadcastEndGameMessage(winningPlayer: Player) {
    if (!this.gameArea) return;
    const gameEndMsg = {
      type: 'game_end',
      winningPlayer: winningPlayer.side,
      ownSide: 'left',
      stats: this.gameArea.stats,
    };
    if (this.gameArea.leftPlayer.socket.readyState === WebSocket.OPEN)
      this.gameArea.leftPlayer.socket.send(JSON.stringify(gameEndMsg));
    gameEndMsg.ownSide = 'right';
    if (this.gameArea.rightPlayer.socket.readyState === WebSocket.OPEN)
      this.gameArea.rightPlayer.socket.send(JSON.stringify(gameEndMsg));
  }

  broadcastPlayerLeftMessage(winningPlayer: Player) {
    if (!this.gameArea) return;
    const gameEndMsg = {
      type: 'game_end_give_up',
      winningPlayer: winningPlayer.side,
      ownSide: 'left',
      stats: this.gameArea.stats,
    };
    if (this.gameArea.leftPlayer.socket.readyState === WebSocket.OPEN)
      this.gameArea.leftPlayer.socket.send(JSON.stringify(gameEndMsg));
    gameEndMsg.ownSide = 'right';
    if (this.gameArea.rightPlayer.socket.readyState === WebSocket.OPEN)
      this.gameArea.rightPlayer.socket.send(JSON.stringify(gameEndMsg));
  }

  getJointSettings(): gameSettings {
    const player1 = this.players[0];
    const player2 = this.players[1];
    return {
      playType: this.playType,
      gameType: this.gameType,
      alias1: player1.alias,
      alias2: player2.alias,
      avatar1: player1.avatar,
      avatar2: player2.avatar,
      paddleColour1: player1.paddleColour,
      paddleColour2: player2.paddleColour,
      character1: player1.character,
      character2: player2.character,
      background: getRandomBackground(),
    };
  }

  // TODO: Review if all these parameters are necessary
  startGame() {
    const response: ServerMessage = {
      type: 'game_setup',
      settings: this.getJointSettings(),
    };
    this.broadcastMessage(JSON.stringify(response));
    this.gameArea = new GameArea(
      this.players[0].id,
      this.players[1].id,
      this.players[0].socket,
      this.players[1].socket,
      this.getJointSettings(),
      this,
    );
    this.gameArea.tournament = this.tournament;
    setPowerUpBar(this.gameArea);
    const gameInterval = setInterval(() => {
      this.gameArea!.gameLoop();
    }, 20);
    this.gameArea.intervals.push(gameInterval);
    const gameStartMsg: ServerMessage = { type: 'game_start' };
    this.broadcastMessage(JSON.stringify(gameStartMsg));
  }

  clear() {
    this.players.forEach((player) => this.removePlayer(player.socket));
    this.players.length = 0;
  }
}
