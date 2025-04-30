import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { setupInput, handleInput } from './input.js';
import WebSocket from 'ws';
import {
  checkWallCollision,
  checkPaddleCollision,
  checkGoal,
  checkFakeBallWallCollision,
} from './collisions.js';
import { Player } from './player.js';
import { gameStats } from './gameStats.js';
import { gameSettings } from '../settings.js';
import { GameState } from '../types.js';

// Starting state
//// Constants

//// GameObjects

export const SPEED = 250;
export const CANVAS_HEIGHT = 720;
export const CANVAS_WIDTH = 1200;
export const PADDLE_LEN = CANVAS_HEIGHT * 0.2;
const PADDLE_WID = 12;
export const PADDLE_START_Y_POS = CANVAS_HEIGHT / 2 - PADDLE_LEN / 2;
export const BALL_RADIUS = 10;

export enum gameRunningState {
  playing,
  paused,
  ended,
}

function setPowerUpBar(gameArea: gameArea): void {
  if (gameArea.leftPlayer!.attack) gameArea.leftPlayer!.attack.lastUsed = Date.now();
  if (gameArea.rightPlayer!.attack) gameArea.rightPlayer!.attack.lastUsed = Date.now();

  setInterval(() => {
    if (gameArea.leftPlayer!.attack && gameArea.runningState === gameRunningState.playing) {
      const lastUsed: number = gameArea.leftPlayer!.attack.lastUsed;
      const coolDown: number = gameArea.leftPlayer!.attack.attackCooldown;
      const currentTime: number = Date.now();

      const percentage = Math.min(((currentTime - lastUsed) * 100) / coolDown, 100);
      gameArea.leftPowerBarFill = percentage;

      if (percentage == 100) {
        gameArea.leftPlayer!.attack.attackIsAvailable = true;
      }
    }
  }, 20);

  setInterval(() => {
    if (gameArea.rightPlayer!.attack && gameArea.runningState === gameRunningState.playing) {
      const lastUsed: number = gameArea.rightPlayer!.attack.lastUsed;
      const coolDown: number = gameArea.rightPlayer!.attack.attackCooldown;
      const currentTime: number = Date.now();

      const percentage = Math.min(((currentTime - lastUsed) * 100) / coolDown, 100);
      gameArea.rightPowerBarFill = percentage;

      if (percentage == 100) {
        gameArea.rightPlayer!.attack.attackIsAvailable = true;
      }
    }
  }, 20);
}

export interface gameArea {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPlayer: Player | null;
  rightPlayer: Player | null;
  runningState: gameRunningState;
  lastTime: number;
  fakeBalls: Ball[];
  stats: gameStats;
  leftPowerBarFill: number;
  rightPowerBarFill: number;
  leftAnimation: boolean;
  rightAnimation: boolean;
  gameLoop(): void;
  pause(): void;
  stop(): void;
  broadcastMessage(message: string): void;
}

function initializeGameArea(
  p1socket: WebSocket,
  p2socket: WebSocket,
  gameSettings: gameSettings,
): gameArea {
  const ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, SPEED, SPEED);
  const leftPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    gameSettings.paddleColour1,
    PADDLE_WID,
    PADDLE_START_Y_POS,
  );
  const rightPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    gameSettings.paddleColour2,
    CANVAS_WIDTH - 20,
    PADDLE_START_Y_POS,
  );
  const stats = new gameStats();
  const gameArea: gameArea = {
    ball: ball,
    leftPaddle: leftPaddle,
    rightPaddle: rightPaddle,
    leftPlayer: null,
    rightPlayer: null,
    runningState: gameRunningState.playing,
    lastTime: 0,
    fakeBalls: [],
    stats: stats,
    leftPowerBarFill: 0,
    rightPowerBarFill: 0,
    leftAnimation: false,
    rightAnimation: false,
    gameLoop: () => {},
    pause() {
      this.runningState = gameRunningState.paused;
    },
    stop() {
      this.runningState = gameRunningState.ended;
    },
    broadcastMessage: () => {},
  };
  gameArea.gameLoop = function gameLoop() {
    const currentTime = Date.now() / 1000; // In seconds
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const maxDeltaTime = 0.1;
    const dt = Math.min(deltaTime, maxDeltaTime);

    updateGameArea(dt, this);

    setImmediate(() => this.gameLoop());
  };
  gameArea.broadcastMessage = function broadcastMessage(message: string) {
    if (!this.leftPlayer || !this.rightPlayer) return;
    if (this.leftPlayer.socket.readyState === WebSocket.OPEN) this.leftPlayer.socket.send(message);
    if (this.rightPlayer.socket.readyState === WebSocket.OPEN)
      this.rightPlayer.socket.send(message);
  };
  gameArea.leftPlayer = new Player(
    leftPaddle,
    rightPaddle,
    ball,
    gameSettings.alias1,
    gameSettings.character1 ? gameSettings.character1.attack : null,
    'left',
    p1socket,
    stats,
    gameArea,
  );
  gameArea.rightPlayer = new Player(
    rightPaddle,
    leftPaddle,
    ball,
    gameSettings.alias2,
    gameSettings.character2 ? gameSettings.character2.attack : null,
    'right',
    p2socket,
    stats,
    gameArea,
  );
  return gameArea;
}

export function initializeRemoteGame(
  player1socket: WebSocket,
  player2socket: WebSocket,
  gameSettings: gameSettings,
): void {
  const gameArea = initializeGameArea(player1socket, player2socket, gameSettings);
  setupInput(gameArea);
  setPowerUpBar(gameArea);
  gameArea.gameLoop();
}

async function updateGameArea(dt: number, gameArea: gameArea) {
  handleInput(gameArea);

  gameArea.leftPaddle.update(dt);
  gameArea.rightPaddle.update(dt);
  gameArea.ball.move(dt);

  // Send fakeBalls in gameRunningState?
  gameArea.fakeBalls.forEach((fakeBall) => fakeBall.move(dt));

  checkWallCollision(gameArea.ball);
  gameArea.fakeBalls.forEach((fakeBall) => checkFakeBallWallCollision(fakeBall));
  checkPaddleCollision(gameArea);

  await checkGoal(gameArea);

  const gameSate = {
    ball: gameArea.ball,
    leftPaddle: gameArea.leftPaddle,
    rightPaddle: gameArea.rightPaddle,
    leftPowerBarFill: gameArea.leftPowerBarFill,
    rightPowerBarFill: gameArea.rightPowerBarFill,
    leftAnimation: gameArea.leftAnimation,
    rightAnimation: gameArea.rightAnimation,
  } as GameState;

  gameArea.broadcastMessage(JSON.stringify(gameSate));
}

export function getGameVersion(gameArea: gameArea): number {
  return gameArea.leftPlayer!.getScore() + gameArea.rightPlayer!.getScore();
}

export function endGameIfRunning(gameArea: gameArea): void {
  if (gameArea.runningState !== gameRunningState.ended) gameArea.stop();
}
