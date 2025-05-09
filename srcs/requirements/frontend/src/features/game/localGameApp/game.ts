/**
 * @file game.ts
 * @brief Main game logic and setup for the Pong game.
 */

import { Paddle } from './paddle.js';
import { Ball, ballCountdown } from './ball.js';
import { setupInput, handleInput } from './input.js';
import {
  checkWallCollision,
  checkPaddleCollision,
  checkGoal,
  checkFakeBallWallCollision,
} from './collisions.js';
import type { GameArea } from './types.js';
import type { gameSettings, playType, gameType } from '../gameSettings/gameSettings.types.js';
import type { background } from '../backgroundData/backgroundData.types.js';
import { Player } from './player.js';
import {
  activatePowerBarAnimation,
  deactivatePowerBarAnimation,
} from '../animations/animations.js';
import { gameStats } from '../gameStats/gameStatsTypes.js';
import { wait } from '../../../utils/helpers.js';

/** @brief Speed of the ball in the game. */
export const SPEED = 250;

/** @brief Height of the game canvas. */
export const CANVAS_HEIGHT = 720;

/** @brief Width of the game canvas. */
export const CANVAS_WIDTH = 1200;

/** @brief Length of the paddle. */
export const PADDLE_LEN = CANVAS_HEIGHT * 0.2;

/** @brief Width of the paddle. */
const PADDLE_WID = 12;

/** @brief Starting Y position of the paddle. */
export const PADDLE_START_Y_POS = CANVAS_HEIGHT / 2 - PADDLE_LEN / 2;

/** @brief Radius of the ball. */
export const BALL_RADIUS = 10;

/** @brief Time of the last frame. */
let lastTime = 0;

/** @brief ID of the current animation frame. */
let animationFrameId: number | null = null;

/** @brief Time left for the initial countdown. */
let countdownTimeLeft = 3;

/** @brief Timer for blinking during the countdown. */
let countdownBlinkTimer = 0;

/** @brief Visibility state of the countdown. */
let countdownVisible = true;

/** @brief Whether the initial countdown is active. */
let isInitialCountdownActive = true;

let rightPaddle: Paddle;
let leftPaddle: Paddle;
let ball: Ball;

/** @brief Array of fake balls in the game. */
export let fakeBalls: Ball[] = [];

let leftPlayer: Player;
let rightPlayer: Player;

/** @brief Game statistics. */
export let stats: gameStats = new gameStats();

/** @brief Input handler type definition. */
export type InputHandler = {
  enable(): void;
  disable(): void;
};

/** @brief Enum representing the state of the game. */
export enum gameState {
  playing,
  paused,
  ended,
}

/**
 * @brief Game area object containing canvas and game state.
 */
const myGameArea: GameArea = {
  canvas: null,
  context: null,
  interval: undefined,
  inputHandler: null,
  state: gameState.paused,

  /**
   * @brief Starts the game area by initializing the canvas and game loop.
   */
  start() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    if (!this.canvas) {
      console.error('No game-canvas present');
      return;
    }

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext('2d');
    if (!this.context) {
      console.error('No canvas context available');
      return;
    }
    this.state = gameState.playing;

    animationFrameId = requestAnimationFrame(updateGameArea);
  },

  /**
   * @brief Clears the game canvas.
   */
  clear() {
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  /**
   * @brief Stops the game loop and disables input.
   */
  stop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    this.inputHandler?.disable();
    this.state = gameState.ended;
  },
};

/**
 * @brief Sets up the paddles for the game.
 * @param gameSettings Settings for the game, including paddle colors.
 */
function setPaddles(gameSettings: gameSettings) {
  if (!gameSettings.paddleColour1 || !gameSettings.paddleColour2) {
    console.error('Paddle color missing.');
    return;
  }
  leftPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    gameSettings.paddleColour1,
    PADDLE_WID,
    PADDLE_START_Y_POS,
  );
  rightPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    gameSettings.paddleColour2,
    CANVAS_WIDTH - 20,
    PADDLE_START_Y_POS,
  );
}

/**
 * @brief Sets up the players for the game.
 * @param leftPaddle Paddle for the left player.
 * @param rightPaddle Paddle for the right player.
 * @param ball Ball object for the game.
 * @param gameSettings Settings for the game.
 */
function setPlayers(
  leftPaddle: Paddle,
  rightPaddle: Paddle,
  ball: Ball,
  gameSettings: gameSettings,
): void {
  leftPlayer = new Player(
    leftPaddle,
    rightPaddle,
    ball,
    gameSettings.alias1,
    gameSettings.character1 ? gameSettings.character1.attack : null,
    gameSettings.character2 ? gameSettings.character2.attack : null,
    'left',
  );
  rightPlayer = new Player(
    rightPaddle,
    leftPaddle,
    ball,
    gameSettings.alias2,
    gameSettings.character2 ? gameSettings.character2.attack : null,
    gameSettings.character1 ? gameSettings.character1.attack : null,
    'right',
  );

  /**
   * @brief Sets up the power-up bar for a player.
   * @param player Player object.
   */
  function setPowerUpBar(player: Player): void {
    const PlayerBar = document.getElementById(`${player.side}-character-power-bar-fill`);

    if (!PlayerBar) {
      console.warn(`${player.side} player bar not found`);
      return;
    }

    let filledAnimationIsOn = false;

    if (player.attack) player.attack.lastUsed = Date.now();

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

/**
 * @brief Initializes a local game with the given settings.
 * @param gameSettings Settings for the game.
 */
export function initializeLocalGame(gameSettings: gameSettings): void {
  const pongPage = document.getElementById('game-container') as HTMLElement | null;
  if (!pongPage) {
    console.error('Cannot start the game: game-container is missing.');
    return;
  }

  updateBackground(gameSettings.background);
  setPaddles(gameSettings);
  ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, SPEED, SPEED);
  setPlayers(leftPaddle, rightPaddle, ball, gameSettings);
  stats.reset();
  myGameArea.inputHandler = setupInput(leftPlayer, rightPlayer, gameSettings.gameType);
  myGameArea.start();
}

/**
 * @brief Updates the game area, including game logic and rendering.
 * @param currentTime Current time in milliseconds.
 */
async function updateGameArea(currentTime: number) {
  animationFrameId = requestAnimationFrame(updateGameArea);

  if (lastTime === 0) {
    lastTime = currentTime;
  }
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  const maxDeltaTime = 0.1;
  const dt = Math.min(deltaTime, maxDeltaTime);

  myGameArea.clear();

  handleInput(leftPlayer, rightPlayer, myGameArea.state);

  if (!myGameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }

  if (isInitialCountdownActive) {
    countdownTimeLeft -= dt;
    countdownBlinkTimer -= dt;

    if (countdownBlinkTimer <= 0) {
      countdownVisible = !countdownVisible;
      countdownBlinkTimer = 0.5;
    }

    if (myGameArea.context) {
      leftPaddle.draw(myGameArea.context);
      rightPaddle.draw(myGameArea.context);
      if (countdownVisible) {
        ball.draw(myGameArea.context);
      }
    }

    if (countdownTimeLeft <= 0) {
      isInitialCountdownActive = false;
      myGameArea.inputHandler?.enable();
      myGameArea.state = gameState.playing;
    }
    return;
  }

  leftPaddle.update(dt);
  rightPaddle.update(dt);
  ball.move(dt);
  fakeBalls.forEach((fakeBall) => fakeBall.move(dt));

  checkWallCollision(ball, myGameArea);
  fakeBalls.forEach((fakeBall) => checkFakeBallWallCollision(fakeBall, myGameArea));
  checkPaddleCollision(ball, leftPaddle, rightPaddle);

  await checkGoal(leftPlayer, rightPlayer, myGameArea);

  if (myGameArea.context) {
    leftPaddle.draw(myGameArea.context);
    rightPaddle.draw(myGameArea.context);
    ball.draw(myGameArea.context);
    fakeBalls.forEach((fakeBall) => fakeBall.draw(myGameArea.context as CanvasRenderingContext2D));
  }
}

/**
 * @brief Updates the background image of the game.
 * @param background Background data object.
 */
function updateBackground(background: background | null) {
  if (!background) return;
  const backgroundImg = document.getElementById('game-background') as HTMLImageElement;
  backgroundImg.src = background.imagePath;
}

/**
 * @brief Gets the current game version based on player scores.
 * @return The game version as a number.
 */
export function getGameVersion(): number {
  return leftPlayer.getScore() + rightPlayer.getScore();
}

/**
 * @brief Gets the game area object.
 * @return The game area object.
 */
export function getGameArea(): GameArea {
  return myGameArea;
}

/**
 * @brief Paints the score for a given side.
 * @param side The side of the player ("left" or "right").
 * @param score The score to paint.
 */
export function paintScore(side: string, score: number): void {
  const emptyScorePoint = document.getElementById(`${side}-score-card-${score}`);
  if (!emptyScorePoint) {
    console.warn(`No element found: ${side}-score-card-${score}`);
    return;
  }

  const colour = emptyScorePoint.className.match(/border-([a-z]+)-500/)?.[1];

  emptyScorePoint.classList.remove('border-2', `border-${colour}-500`);
  emptyScorePoint.classList.add(`bg-${colour}-500`);
}

/**
 * @brief Ends the local game if it is currently running.
 */
export function endLocalGameIfRunning(): void {
  if (myGameArea.state !== gameState.ended) {
    lastTime = 0;
    countdownTimeLeft = 3;
    countdownBlinkTimer = 0;
    countdownVisible = true;
    isInitialCountdownActive = true;
    stats.reset();
    myGameArea.stop();
  }
}
