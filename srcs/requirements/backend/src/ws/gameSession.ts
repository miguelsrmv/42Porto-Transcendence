import WebSocket from 'ws';
import {
  character,
  gameSettings,
  gameType,
  playerSettings,
  playType,
} from './remoteGameApp/settings';
import { GameArea } from './remoteGameApp/gameArea';
import { BlockchainScoreData, Tournament, tournamentState } from './tournament';
import { Player } from './remoteGameApp/player';
import { setPowerUpBar } from './remoteGameApp/game';
import { gameRunningState, ServerMessage } from './remoteGameApp/types';
import { createMatchPlayerLeft } from './remoteGameApp/gameEnd';
import { getAvatarFromPlayer } from '../api/services/user.services';
import { getRandomBackground } from './remoteGameApp/backgroundData';
import { updateLeaderboardRemote } from '../api/services/leaderboard.services';
import { gameTypeToEnum } from '../utils/helpers';

export class PlayerInfo {
  id: string;
  socket: WebSocket;
  alias: string;
  avatar: string;
  paddleColour: string;
  character: character | null;
  readyForNextRound: boolean = false;
  scoreQuarterFinals: number = 0;
  scoreSemiFinals?: number;
  scoreFinals?: number;

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
    console.log(`Removing ${playerToRemove.alias}`);
    const index = this.players.indexOf(playerToRemove);
    if (index !== -1) this.players.splice(index, 1);
    if (!this.gameArea) return;
    if (this.players.length === 0) return;
    if (this.gameArea.runningState !== gameRunningState.ended) this.gameArea.stop();

    const playerWhoLeft = this.gameArea.getPlayerByWebSocket(ws);
    if (playerWhoLeft.isEliminated) return; // score already saved in endGame

    const playerWhoStayed = this.gameArea.getOtherPlayer(playerWhoLeft);
    this.broadcastPlayerLeftMessage(playerWhoStayed);
    if (this.tournament && this.tournament.state === tournamentState.ongoing) {
      // TODO: Check if order of users matter
      const data: BlockchainScoreData = {
        tournamentId: this.tournament.id,
        gameType: gameTypeToEnum(this.tournament.type),
        player1Id: playerWhoStayed.id,
        score1: 5, // hard-coded win
        player2Id: playerWhoLeft.id,
        score2: playerWhoLeft.score,
      };
      await this.tournament.updateSessionScore(this, playerWhoStayed.id, data);
    } else {
      await createMatchPlayerLeft(playerWhoStayed, this.gameArea);
      await updateLeaderboardRemote(playerWhoStayed, playerWhoLeft);
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
    console.log(`Player left from match with ${winningPlayer.alias}`);
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
    console.log(`Starting game between: ${this.players[0].alias} and ${this.players[1].alias}`);
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
    const gameInterval = setInterval(async () => {
      try {
        await this.gameArea!.gameLoop();
      } catch (err) {
        console.error('Game loop error:', err);
      }
    }, 20);
    this.gameArea.intervals.push(gameInterval);
    const gameStartMsg: ServerMessage = { type: 'game_start' };
    this.broadcastMessage(JSON.stringify(gameStartMsg));
  }

  async clear() {
    console.log('Clearing session');
    await Promise.allSettled(this.players.map((player) => this.removePlayer(player.socket)));
    this.players.length = 0;
  }

  playerIsInSession(ws: WebSocket) {
    return this.players.some((p) => p.socket === ws);
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
