import { Ball } from './ball.js';
import { setupInput, handleInput } from './input.js';
import WebSocket from 'ws';
import {
  checkWallCollision,
  checkPaddleCollision,
  checkGoal,
  checkFakeBallWallCollision,
} from './collisions.js';
import { gameStats } from './gameStats.js';
import { gameSettings } from './settings.js';
import { ClientMessage, GameState, ServerMessage } from './types.js';
import { Paddle } from './paddle.js';
import { Player } from './player.js';
import { removePlayer } from './sessionManagement.js';

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

function setPlayerPowerBarInterval(player: Player, gameArea: gameArea) {
  if (player.attack) player.attack.lastUsed = Date.now();

  const interval = setInterval(() => {
    if (player.attack && gameArea.runningState === gameRunningState.playing) {
      const lastUsed: number = player.attack.lastUsed;
      const coolDown: number = player.attack.attackCooldown;
      const currentTime: number = Date.now();

      const percentage = Math.min(((currentTime - lastUsed) * 100) / coolDown, 100);
      player.powerBarFill = percentage;

      if (percentage == 100) {
        player.attack.attackIsAvailable = true;
      }
    }
  }, 20);
  gameArea.intervals.push(interval);
}

function setPowerUpBar(gameArea: gameArea): void {
  setPlayerPowerBarInterval(gameArea.leftPlayer!, gameArea);
  setPlayerPowerBarInterval(gameArea.rightPlayer!, gameArea);
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
  leftAnimation: boolean;
  rightAnimation: boolean;
  countdownTimeLeft: number;
  countdownBlinkTimer: number;
  countdownVisible: boolean;
  isInitialCountdownActive: boolean;
  intervals: NodeJS.Timeout[];
  gameLoop(): void;
  pause(): void;
  stop(): void;
  broadcastSessionMessage(message: string): void;
  clear(): void;
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
    runningState: gameRunningState.paused,
    lastTime: 0,
    fakeBalls: [],
    stats: stats,
    leftAnimation: false,
    rightAnimation: false,
    countdownTimeLeft: 3,
    countdownBlinkTimer: 0,
    countdownVisible: true,
    isInitialCountdownActive: true,
    intervals: [],
    gameLoop: () => {},
    pause() {
      this.runningState = gameRunningState.paused;
    },
    stop() {
      this.runningState = gameRunningState.ended;
      this.clear();
    },
    broadcastSessionMessage: () => {},
    clear() {
      this.intervals.forEach((interval) => clearInterval(interval));
    },
  };
  gameArea.gameLoop = async function gameLoop() {
    const currentTime = Date.now() / 1000; // In seconds
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const maxDeltaTime = 0.1;
    const dt = Math.min(deltaTime, maxDeltaTime);

    if (this.isInitialCountdownActive) {
      // Handle countdown logic
      this.countdownTimeLeft -= dt;
      this.countdownBlinkTimer -= dt;

      if (this.countdownBlinkTimer <= 0) {
        this.countdownVisible = !this.countdownVisible;
        this.countdownBlinkTimer = 0.5; // Blink every 0.5s
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
      const gameState = {
        ball: gameArea.ball,
        fakeBalls: gameArea.fakeBalls,
        leftPaddle: gameArea.leftPaddle,
        rightPaddle: gameArea.rightPaddle,
        leftPowerBarFill: gameArea.leftPlayer!.powerBarFill,
        rightPowerBarFill: gameArea.rightPlayer!.powerBarFill,
        leftAnimation: gameArea.leftAnimation,
        rightAnimation: gameArea.rightAnimation,
      } as GameState;
      // TODO: Filter before sending
      const gameStateMsg = { type: 'game_state', state: gameState } as ServerMessage;
      this.broadcastSessionMessage(JSON.stringify(gameStateMsg));
      return; // Exit early, don't update game yet
    }

    await updateGameArea(dt, this);
  };
  gameArea.broadcastSessionMessage = function broadcastSessionMessage(message: string) {
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

function closeGameHandler(socket1: WebSocket, socket2: WebSocket, gameArea: gameArea) {
  const playerLeft = { type: 'player_left' } as ServerMessage;
  socket1.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString()) as ClientMessage;
    if (parsedMessage.type === 'stop_game') {
      gameArea.stop();
      removePlayer(socket1);
      if (socket2.readyState === WebSocket.OPEN) socket2.send(JSON.stringify(playerLeft));
      removePlayer(socket2);
    }
  });
}

function setCloseGame(player1socket: WebSocket, player2socket: WebSocket, gameArea: gameArea) {
  closeGameHandler(player1socket, player2socket, gameArea);
  closeGameHandler(player2socket, player1socket, gameArea);
}

export function initializeRemoteGame(
  player1socket: WebSocket,
  player2socket: WebSocket,
  gameSettings: gameSettings,
): void {
  const gameArea = initializeGameArea(player1socket, player2socket, gameSettings);
  setupInput(gameArea);
  setPowerUpBar(gameArea);
  setCloseGame(player1socket, player2socket, gameArea);
  const gameInterval = setInterval(() => {
    gameArea.gameLoop();
  }, 20);
  gameArea.intervals.push(gameInterval);
}

async function updateGameArea(dt: number, gameArea: gameArea) {
  handleInput(gameArea);

  gameArea.leftPaddle.update(dt);
  gameArea.rightPaddle.update(dt);
  gameArea.ball.move(dt);
  gameArea.fakeBalls.forEach((fakeBall) => fakeBall.move(dt));

  checkWallCollision(gameArea.ball);
  gameArea.fakeBalls.forEach((fakeBall) => checkFakeBallWallCollision(fakeBall));
  checkPaddleCollision(gameArea);

  await checkGoal(gameArea);

  const gameState = {
    ball: gameArea.ball,
    fakeBalls: gameArea.fakeBalls,
    leftPaddle: gameArea.leftPaddle,
    rightPaddle: gameArea.rightPaddle,
    leftPowerBarFill: gameArea.leftPlayer!.powerBarFill,
    rightPowerBarFill: gameArea.rightPlayer!.powerBarFill,
    leftAnimation: gameArea.leftAnimation,
    rightAnimation: gameArea.rightAnimation,
  } as GameState;
  // TODO: Filter before sending
  const gameStateMsg = { type: 'game_state', state: gameState } as ServerMessage;
  gameArea.broadcastSessionMessage(JSON.stringify(gameStateMsg));
}

export function getGameVersion(gameArea: gameArea): number {
  return gameArea.leftPlayer!.getScore() + gameArea.rightPlayer!.getScore();
}

export function endGameIfRunning(gameArea: gameArea): void {
  if (gameArea.runningState !== gameRunningState.ended) gameArea.stop();
}
