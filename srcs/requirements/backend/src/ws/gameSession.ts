import WebSocket from 'ws';
import { gameSettings, gameType, playerSettings, playType } from './remoteGameApp/settings';
import { GameArea } from './remoteGameApp/gameArea';
import { BlockchainScoreData, Tournament } from './tournament';
import { Player } from './remoteGameApp/player';
import { setPowerUpBar } from './remoteGameApp/game';
import { gameRunningState, ServerMessage } from './remoteGameApp/types';
import { createMatchPlayerLeft } from './remoteGameApp/gameEnd';
import { getAvatarFromPlayer } from '../api/services/user.services';
import { getRandomBackground } from './remoteGameApp/backgroundData';
import { updateLeaderboardRemote } from '../api/services/leaderboard.services';
import { gameTypeToEnum } from '../utils/helpers';
import { character } from './remoteGameApp/characterData';
import { closeSocket, removeItem } from './helpers';

export class PlayerInfo {
  id: string;
  socket: WebSocket;
  alias: string;
  avatar: string;
  paddleColour: string;
  character: character | null;
  isDisconnected: boolean = false;
  lastConnectedAt: number = Date.now();
  readyForNextRound: boolean = false;
  scoreQuarterFinals?: number;
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
  aliases: string[] = [];

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
    this.aliases.push(playerSettings.alias);
  }

  reconnectPlayer(playerId: string, newSocket: WebSocket) {
    const player = this.getPlayerInfo(playerId);
    if (!player) return;
    player.socket = newSocket;
    player.isDisconnected = false;
  }

  async removePlayerSession(playerId: string) {
    const playerToRemove = this.players.find((player) => player.id === playerId);
    if (!playerToRemove) return;
    console.log(`Removing ${playerToRemove.alias} from session`);
    removeItem(this.players, playerToRemove);
    removeItem(this.aliases, playerToRemove.alias);
    if (!this.gameArea) return;
    this.gameArea.stop();
    if (this.players.length === 0 || this.tournament) return;
    await this.remotePlayerLeftHandle(playerId);
  }

  private async remotePlayerLeftHandle(playerId: string) {
    if (!this.gameArea) return;
    const playerWhoLeft = this.gameArea.getPlayerById(playerId);
    if (playerWhoLeft.isEliminated) return; // score already saved in endGame
    const playerWhoStayed = this.gameArea.getOtherPlayer(playerWhoLeft);
    this.sendGameEndToRemainingPlayer(playerWhoStayed);
    await createMatchPlayerLeft(playerWhoStayed, this.gameArea);
    await updateLeaderboardRemote(playerWhoStayed, playerWhoLeft);
    const winnerSocket = this.getPlayerSocket(playerWhoStayed.id);
    if (winnerSocket) closeSocket(winnerSocket);
  }

  isFull(): boolean {
    return this.players.length === 2;
  }

  isEmpty(): boolean {
    return this.players.length === 0;
  }

  hasDisconnectedPlayers(): boolean {
    return this.players.some((p) => p.isDisconnected);
  }

  getPlayers() {
    return this.players;
  }

  getPlayerInfo(playerId: string) {
    return this.players.find((p) => p.id === playerId);
  }

  getPlayerIds() {
    const ids = new Set<string>(this.players.flatMap((player) => player.id));
    return Array.from(ids);
  }

  getPlayerSocket(playerId: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) return;
    return player.socket;
  }

  sendToPlayer(playerId: string, message: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) return;
    if (player.socket.readyState === WebSocket.OPEN) player.socket.send(message);
  }

  broadcastMessage(message: string) {
    this.players.forEach((player) => {
      if (player.socket.readyState === WebSocket.OPEN) player.socket.send(message);
    });
  }

  broadcastEndGameMessage(winningPlayer: Player) {
    if (!this.gameArea) return;
    const gameEndMsg: ServerMessage = {
      type: 'game_end',
      winningPlayer: winningPlayer.side,
      ownSide: 'left',
      stats: this.gameArea.stats,
    };
    this.sendToPlayer(this.gameArea.leftPlayer.id, JSON.stringify(gameEndMsg));
    gameEndMsg.ownSide = 'right';
    this.sendToPlayer(this.gameArea.rightPlayer.id, JSON.stringify(gameEndMsg));
  }

  sendGameEndToRemainingPlayer(winningPlayer: Player) {
    if (!this.gameArea) return;
    this.gameArea.stats.setMaxGoals(winningPlayer.side);
    const gameEndMsg: ServerMessage = {
      type: 'game_end',
      winningPlayer: winningPlayer.side,
      ownSide: winningPlayer.side,
      stats: this.gameArea.stats,
    };
    this.sendToPlayer(winningPlayer.id, JSON.stringify(gameEndMsg));
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

  private getConnectedPlayer() {
    return this.players.find((p) => !p.isDisconnected);
  }

  public async markAsDisconnected(playerId: string) {
    if (!this.tournament) return;
    const leavingPlayer = this.getPlayerInfo(playerId);
    if (!leavingPlayer) return;
    leavingPlayer.isDisconnected = true;
    console.log(`${leavingPlayer.alias} disconnected`);
    if (!this.gameArea) return;
    if (this.gameArea.runningState === gameRunningState.ended) return;
    this.gameArea.stop();
    await this.tournamentPlayerLeftHandler(playerId, leavingPlayer);
  }

  private async tournamentPlayerLeftHandler(playerId: string, leavingPlayer: PlayerInfo) {
    if (!this.tournament || !this.gameArea) return;
    const playerWhoLeft = this.gameArea.getPlayerById(playerId);
    if (playerWhoLeft.isEliminated) return; // score already saved in endGame
    const playerWhoStayed = this.gameArea.getOtherPlayer(playerWhoLeft);
    this.sendGameEndToRemainingPlayer(playerWhoStayed);
    const stayingPlayer = this.players.find((p) => p.id === playerWhoStayed.id);
    if (!leavingPlayer || !stayingPlayer || stayingPlayer.isDisconnected) return;
    console.log(`${leavingPlayer.alias} left the match with ${stayingPlayer.alias}`);
    if (this.round === 3)
      this.sendToPlayer(playerWhoStayed.id, JSON.stringify({ type: 'tournament_end' }));
    const data: BlockchainScoreData = {
      tournamentId: this.tournament.id,
      gameType: gameTypeToEnum(this.tournament.type),
      player1Data: [stayingPlayer.id, stayingPlayer.alias, stayingPlayer.character?.name ?? 'NONE'],
      score1: 5, // hard-coded win
      player2Data: [leavingPlayer.id, leavingPlayer.alias, leavingPlayer.character?.name ?? 'NONE'],
      score2: playerWhoLeft.score,
    };
    this.winner = playerWhoStayed.id;
    await this.tournament.updateSessionScore(this.round, playerWhoStayed.id, data);
  }

  private getLastToLeavePlayer() {
    return this.players[0].lastConnectedAt > this.players[1].lastConnectedAt
      ? this.players[0]
      : this.players[1];
  }

  private getOtherPlayer(playerId: string) {
    return this.players.find((p) => p.id !== playerId);
  }

  private async endSessionForfeit() {
    if (!this.tournament) return;
    let remainingPlayer = this.getConnectedPlayer();
    if (!remainingPlayer) {
      console.log(`Both players missing for match`);
      remainingPlayer = this.getLastToLeavePlayer();
    }
    console.log(`${remainingPlayer.alias} auto-advances due to missing opponent`);
    this.gameArea?.stop();
    this.sendToPlayer(remainingPlayer.id, JSON.stringify({ type: 'game_start' } as ServerMessage));
    const player = this.gameArea?.getPlayerById(remainingPlayer.id);
    this.sendGameEndToRemainingPlayer(player!);
    if (this.tournament.currentRound === 3)
      this.sendToPlayer(remainingPlayer.id, JSON.stringify({ type: 'tournament_end' }));
    const leavingPlayer = this.getOtherPlayer(remainingPlayer.id);
    if (!leavingPlayer) return;
    this.gameArea!.getPlayerById(leavingPlayer.id).isEliminated = true;
    const data: BlockchainScoreData = {
      tournamentId: this.tournament.id,
      gameType: gameTypeToEnum(this.tournament.type),
      player1Data: [
        remainingPlayer.id,
        remainingPlayer.alias,
        remainingPlayer.character?.name ?? 'NONE',
      ],
      score1: 5, // hard-coded win
      player2Data: [leavingPlayer.id, leavingPlayer.alias, leavingPlayer.character?.name ?? 'NONE'],
      score2: 0, // hard-coded loss due to forfeit
    };
    this.winner = remainingPlayer.id;
    await this.tournament.updateSessionScore(this.round, remainingPlayer.id, data);
  }

  async startGame() {
    console.log(`Starting game between: ${this.players[0].alias} and ${this.players[1].alias}`);
    const response: ServerMessage = {
      type: 'game_setup',
      settings: this.getJointSettings(),
    };
    this.broadcastMessage(JSON.stringify(response));
    this.gameArea = new GameArea(
      this.players[0].id,
      this.players[1].id,
      this.getJointSettings(),
      this,
    );
    this.gameArea.tournament = this.tournament;
    if (this.hasDisconnectedPlayers()) {
      await this.endSessionForfeit();
      return;
    }
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
    if (this.players.length === 0) return;
    console.log('Clearing session');
    await Promise.allSettled(this.players.map((player) => this.removePlayerSession(player.id)));
    this.players.length = 0;
  }

  playerIsInSession(playerId: string) {
    return this.players.some((p) => p.id === playerId);
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
