import { GameSession } from '../gameSession';
import { Tournament } from '../tournament';
import { Ball } from './ball';
import { updateGameArea } from './game';
import { gameStats } from './gameStats';
import { Paddle } from './paddle';
import { Player } from './player';
import { gameSettings } from './settings';
import { gameRunningState, GameState, ServerMessage } from './types';
import WebSocket from 'ws';

export const SPEED = 250;
export const CANVAS_HEIGHT = 720;
export const CANVAS_WIDTH = 1200;
export const PADDLE_LEN = CANVAS_HEIGHT * 0.2;
const PADDLE_WID = 12;
export const PADDLE_START_Y_POS = CANVAS_HEIGHT / 2 - PADDLE_LEN / 2;
export const BALL_RADIUS = 10;

export class GameArea {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPlayer: Player;
  rightPlayer: Player;
  runningState = gameRunningState.paused;
  lastTime = 0;
  fakeBalls: Ball[] = [];
  stats = new gameStats();
  leftAnimation = false;
  rightAnimation = false;
  countdownTimeLeft = 3;
  countdownBlinkTimer = 0;
  countdownVisible = true;
  isInitialCountdownActive = true;
  intervals: NodeJS.Timeout[] = [];
  settings: gameSettings;
  isEnding: boolean;
  session: GameSession;
  tournament?: Tournament;

  constructor(
    p1id: string,
    p2id: string,
    p1socket: WebSocket,
    p2socket: WebSocket,
    gameSettings: gameSettings,
    session: GameSession,
  ) {
    this.session = session;
    this.settings = gameSettings;
    this.isEnding = false;
    this.ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, SPEED, SPEED);
    this.leftPaddle = new Paddle(
      PADDLE_WID,
      PADDLE_LEN,
      gameSettings.paddleColour1,
      PADDLE_WID,
      PADDLE_START_Y_POS,
    );
    this.rightPaddle = new Paddle(
      PADDLE_WID,
      PADDLE_LEN,
      gameSettings.paddleColour2,
      CANVAS_WIDTH - 20,
      PADDLE_START_Y_POS,
    );

    this.leftPlayer = new Player(
      p1id,
      this.leftPaddle,
      this.rightPaddle,
      this.ball,
      gameSettings.alias1,
      gameSettings.character1?.attack ?? null,
      gameSettings.character2 ? gameSettings.character2.attack : null,
      'left',
      p1socket,
      this.stats,
      this,
    );
    this.rightPlayer = new Player(
      p2id,
      this.rightPaddle,
      this.leftPaddle,
      this.ball,
      gameSettings.alias2,
      gameSettings.character2?.attack ?? null,
      gameSettings.character1 ? gameSettings.character1.attack : null,
      'right',
      p2socket,
      this.stats,
      this,
    );
  }

  pause() {
    this.runningState = gameRunningState.paused;
  }

  stop() {
    this.runningState = gameRunningState.ended;
    this.clear();
    console.log('Stopping game');
  }

  clear() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }

  broadcastSessionMessage(message: string) {
    if (!this.leftPlayer || !this.rightPlayer) return;
    if (this.leftPlayer.socket.readyState === WebSocket.OPEN) this.leftPlayer.socket.send(message);
    if (this.rightPlayer.socket.readyState === WebSocket.OPEN)
      this.rightPlayer.socket.send(message);
  }

  getPlayerByWebSocket(socket: WebSocket) {
    return socket === this.leftPlayer.socket ? this.leftPlayer : this.rightPlayer;
  }

  getOtherPlayer(player: Player) {
    return player === this.leftPlayer ? this.rightPlayer : this.leftPlayer;
  }

  async gameLoop() {
    const currentTime = Date.now() / 1000;
    if (this.lastTime === 0) this.lastTime = currentTime;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const maxDeltaTime = 0.1;
    const dt = Math.min(deltaTime, maxDeltaTime);

    if (this.isInitialCountdownActive) {
      this.countdownTimeLeft -= dt;
      this.countdownBlinkTimer -= dt;

      if (this.countdownBlinkTimer <= 0) {
        this.countdownVisible = !this.countdownVisible;
        this.countdownBlinkTimer = 0.5;
      }

      this.ball.isVisible = false;
      if (this.countdownVisible) {
        this.ball.isVisible = true;
      }

      if (this.countdownTimeLeft <= 0) {
        this.isInitialCountdownActive = false;
        this.ball.isVisible = true;
        this.runningState = gameRunningState.playing;
      }

      const gameState: GameState = {
        ball: this.ball,
        fakeBalls: this.fakeBalls,
        leftPaddle: this.leftPaddle,
        rightPaddle: this.rightPaddle,
        leftPowerBarFill: this.leftPlayer.powerBarFill,
        rightPowerBarFill: this.rightPlayer.powerBarFill,
        leftAnimation: this.leftAnimation,
        rightAnimation: this.rightAnimation,
      };

      const gameStateMsg: ServerMessage = { type: 'game_state', state: gameState };
      this.broadcastSessionMessage(JSON.stringify(gameStateMsg));
      return;
    }

    await updateGameArea(dt, this);
  }
}
