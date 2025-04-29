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
import { GameSate } from '../types.js';

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

//let lastTime = 0; // Time of the last frame
//let animationFrameId: number | null = null; // To potentially stop the loop

export const stats: gameStats = new gameStats();

export type InputHandler = {
  enable(): void;
  disable(): void;
};

export enum gameState {
  playing,
  paused,
  ended,
}

function setPlayers(gameState: GameSate, gameSettings: gameSettings): [Player, Player] {
  function setPowerUpBar(player: Player): void {
    const PlayerBar = document.getElementById(`${player.side}-character-power-bar-fill`);

    if (!PlayerBar) {
      console.warn(`${player.side} player bar not found`);
      return;
    }

    let filledAnimationIsOn = false;

    window.setInterval(() => {
      if (player.attack && myGameArea.state === gameState.playing) {
        const lastUsed: number = player.attack.lastUsed;
        const coolDown: number = player.attack.attackCooldown;
        const currentTime: number = Date.now();

        const percentage = Math.min(((currentTime - lastUsed) * 100) / coolDown, 100);
        PlayerBar.style.width = `${percentage}%`;

        if (percentage == 100) {
          player.attack.attackIsAvailable = true;
          if (!filledAnimationIsOn) {
            activatePowerBarAnimation(`${player.side}`);
            filledAnimationIsOn = true;
          }
        } else {
          if (filledAnimationIsOn) {
            deactivatePowerBarAnimation(`${player.side}`);
            filledAnimationIsOn = false;
          }
        }
      }
    }, 20);
  }

  setPowerUpBar(leftPlayer);
  setPowerUpBar(rightPlayer);
}



export interface gameArea {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPlayer: Player;
  rightPlayer: Player;
  state: gameState;
  lastTime: number;
  fakeBalls: Ball[];
  gameLoop(): void;
  pause(): void;
  stop(): void;
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
  const gameArea: gameArea = {
    ball: ball,
    leftPaddle: leftPaddle,
    rightPaddle: rightPaddle,
    leftPlayer: new Player(
      leftPaddle,
      rightPaddle,
      ball,
      gameSettings.alias1,
      gameSettings.character1 ? gameSettings.character1.attack : null,
      'left',
      p1socket,
    ),
    rightPlayer: new Player(
      rightPaddle,
      leftPaddle,
      ball,
      gameSettings.alias2,
      gameSettings.character2 ? gameSettings.character2.attack : null,
      'right',
      p2socket,
    ),
    state: gameState.playing,
    lastTime: 0,
    fakeBalls: [],
    gameLoop: () => {},
    pause() {
      this.state = gameState.paused;
    },
    stop() {
      this.state = gameState.ended;
    },
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
  return gameArea;
}

export function initializeRemoteGame(
  player1socket: WebSocket,
  player2socket: WebSocket,
  gameSettings: gameSettings,
): void {
  const gameArea = initializeGameArea(player1socket, player2socket, gameSettings);
  setupInput(gameArea);
  gameArea.gameLoop();
}

async function updateGameArea(dt: number, gameArea: gameArea) {
  handleInput(gameArea);

  gameArea.leftPaddle.update(dt);
  gameArea.rightPaddle.update(dt);
  gameArea.ball.move(dt);
  gameArea.fakeBalls.forEach((fakeBall) => fakeBall.move(dt));

  checkWallCollision(gameArea.ball);
  gameArea.fakeBalls.forEach((fakeBall) => checkFakeBallWallCollision(fakeBall));
  checkPaddleCollision(gameArea.ball, gameArea.leftPaddle, gameArea.rightPaddle);

  await checkGoal(gameArea);

  if (myGameArea.context) {
    leftPaddle.draw(myGameArea.context);
    rightPaddle.draw(myGameArea.context);
    ball.draw(myGameArea.context);
    fakeBalls.forEach((fakeBall) => fakeBall.draw(myGameArea.context as CanvasRenderingContext2D));
  }
}

export function getGameVersion(gameArea: gameArea): number {
  return gameArea.leftPlayer.getScore() + gameArea.rightPlayer.getScore();
}

export function endGameIfRunning(gameArea: gameArea): void {
  if (gameArea.state !== gameState.ended) gameArea.stop();
}
