import WebSocket from 'ws';
import {
  character,
  gameSettings,
  gameType,
  playerSettings,
  playType,
} from './remoteGameApp/settings';
import { GameArea } from './remoteGameApp/gameArea';
import { getAvatarFromPlayer, getRandomBackground, removeSession } from './sessionManagement';
import { Tournament } from './tournament';
import { Player } from './remoteGameApp/player';
import { setPowerUpBar } from './remoteGameApp/game';
import { ServerMessage } from './remoteGameApp/types';
import { createMatchPlayerLeft } from './remoteGameApp/gameEnd';
import { contractSigner } from '../api/services/blockchain.services';

export class PlayerInfo {
  id: string;
  socket: WebSocket;
  alias: string;
  avatar: string;
  paddleColour: string;
  character: character | null;

  constructor(
    id: string,
    socket: WebSocket,
    alias: string,
    avatar: string,
    paddleColour: string,
    character: character | null,
  ) {
    this.id = id;
    this.socket = socket;
    this.alias = alias;
    this.avatar = avatar;
    this.paddleColour = paddleColour;
    this.character = character;
  }

  toJSON() {
    // Exclude the socket when serializing
    return {
      id: this.id,
      alias: this.alias,
      avatar: this.avatar,
      paddleColour: this.paddleColour,
      character: this.character?.name,
    };
  }
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
  }

  async removePlayer(ws: WebSocket) {
    const playerToRemove = this.players.find((player) => player.socket === ws);
    if (!playerToRemove) return;
    const index = this.players.indexOf(playerToRemove);
    if (index !== -1) this.players.splice(index, 1);
    if (!this.gameArea) return;
    const playerWhoLeft = this.gameArea.getPlayerByWebSocket(ws);
    const playerWhoStayed = this.gameArea.getOtherPlayer(playerWhoLeft);
    this.gameArea.stop();
    this.broadcastPlayerLeftMessage(playerWhoStayed);
    if (this.tournament) {
      await this.tournament.updateSessionScore(this, playerWhoStayed.id);
      // TODO: Check if order of users matter
      try {
        const tx = await contractSigner.saveScoreAndAddWinner(
          this.tournament.id,
          this.tournament.type,
          playerWhoStayed.id,
          5, // hard-coded win
          playerWhoLeft.id,
          playerWhoLeft.score,
        );
        await tx.wait();
      } catch (err) {
        console.log(`Error calling saveScoreAndAddWinner in stopGameHandler: ${err}`);
      }
    } else {
      await createMatchPlayerLeft(playerWhoStayed, this.gameArea);
      await this.clear();
      removeSession(this);
    }
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
    // Goals automatically set to 5 for remaining player
    this.gameArea.stats.setMaxGoals(winningPlayer.side);
    // TODO: Differentiate from normal game_end message?
    const gameEndMsg = {
      type: 'game_end',
      winningPlayer: winningPlayer.side,
      ownSide: winningPlayer.side,
      stats: this.gameArea.stats,
    };
    if (winningPlayer.socket.readyState === WebSocket.OPEN)
      winningPlayer.socket.send(JSON.stringify(gameEndMsg));
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

  async clear() {
    this.players.forEach(async (player) => await this.removePlayer(player.socket));
    this.players.length = 0;
  }

  print() {
    return {
      gameType: this.gameType,
      playType: this.playType,
      players: this.players.map((player) => player.toJSON()),
      winner: this.winner,
      round: this.round,
      gameArea: this.gameArea !== null ? 'yes' : 'no',
      tournament: this.tournament !== undefined ? 'yes' : 'no',
    };
  }
}
