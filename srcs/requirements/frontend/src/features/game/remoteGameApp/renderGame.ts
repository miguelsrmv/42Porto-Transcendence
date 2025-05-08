/*
 * * @file gameRenderer.ts
 * @brief This file contains the main rendering logic for the game, including canvas setup, drawing game elements, and handling WebSocket messages.
 */

import {
  activatePowerBarAnimation,
  deactivatePowerBarAnimation,
  powerUpAnimation,
} from '../animations/animations.js';
import { triggerEndGameMenu } from '../gameStats/gameConclusion.js';
import type {
  GameArea,
  GameState,
  Paddle,
  Ball,
  playerStats,
  gameStats,
} from '../gameStats/gameStatsTypes.js';

/** @brief The color of the ball. */
const BALL_COLOUR = 'white';

/** @brief The color of the border around the ball. */
const BORDER_COLOUR = 'gray';

/** @brief Indicates whether the left power bar animation is active. */
let leftPowerBarAnimation: boolean = false;

/** @brief Indicates whether the right power bar animation is active. */
let rightPowerBarAnimation: boolean = false;

/** @brief The score for the left side. */
let leftSideGoal: number = 0;

/** @brief The score for the right side. */
let rightSideGoal: number = 0;

/**
 * @brief Updates the background image of the game.
 * @param backgroundPath The path to the new background image.
 */
export function updateBackground(backgroundPath: string): void {
  const backgroundImg = document.getElementById('game-background') as HTMLImageElement;
  if (!backgroundImg) {
    console.warn("Couldn't find backgroundImg element");
    return;
  }
  backgroundImg.src = backgroundPath;
}

/** @brief The height of the canvas. */
export const CANVAS_HEIGHT = 720;

/** @brief The width of the canvas. */
export const CANVAS_WIDTH = 1200;

/**
 * @brief Represents the game area, including the canvas and its context.
 */
const myGameArea: GameArea = {
  canvas: null,
  context: null,

  /**
   * @brief Initializes the game canvas and its context.
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
  },

  /**
   * @brief Clears the canvas.
   */
  clear() {
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  /**
   * @brief Stops the game area (currently a placeholder).
   */
  stop() {},
};

/**
 * @brief Renders the game and handles WebSocket messages.
 * @param webSocket The WebSocket connection for receiving game state updates.
 */
export function renderGame(webSocket: WebSocket) {
  myGameArea.start();
  const leftPowerBar = document.getElementById('left-character-power-bar-fill');
  if (!leftPowerBar) {
    console.warn('left-character player bar not found');
    return;
  }
  const rightPowerBar = document.getElementById('right-character-power-bar-fill');
  if (!rightPowerBar) {
    console.warn('right-character player bar not found');
    return;
  }
  webSocket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    if (messageData.type === 'game_state') {
      myGameArea.clear();
      drawBoard(myGameArea.context as CanvasRenderingContext2D, messageData.state as GameState);
      drawPowerBar(messageData.state.leftPowerBarFill, leftPowerBar, 'left');
      drawPowerBar(messageData.state.rightPowerBarFill, rightPowerBar, 'right');
      triggerAnimation(messageData.state);
      triggerSound(myGameArea.context as CanvasRenderingContext2D, messageData.state);
    } else if (messageData.type === 'game_goal') {
      renderGoal(messageData.scoringSide);
    } else if (messageData.type === 'game_end') {
      triggerEndGameMenu(
        messageData.winningPlayer,
        messageData.ownSide,
        messageData.stats,
        'Remote Play', // TODO: replace by messageData.playType
      );
      resetVariables();
      webSocket.close();
    }
  };
}

/**
 * @brief Draws the game board, including paddles, balls, and fake balls.
 * @param ctx The canvas rendering context.
 * @param state The current game state.
 */
function drawBoard(ctx: CanvasRenderingContext2D, state: GameState) {
  drawPaddle(ctx, state.leftPaddle);
  drawPaddle(ctx, state.rightPaddle);
  drawBall(ctx, state.ball);
  state.fakeBalls.forEach((fakeBall) => drawBall(ctx, fakeBall));
}

/**
 * @brief Draws a paddle on the canvas.
 * @param ctx The canvas rendering context.
 * @param paddle The paddle to draw.
 */
function drawPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle) {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

/**
 * @brief Draws a ball on the canvas.
 * @param ctx The canvas rendering context.
 * @param ball The ball to draw.
 */
function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  if (ball.isVisible) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = BALL_COLOUR;
    ctx.fill();
    ctx.strokeStyle = BORDER_COLOUR;
    ctx.stroke();
    ctx.closePath();
  }
}

/**
 * @brief Updates the power bar's width and triggers animations if necessary.
 * @param value The current fill percentage of the power bar.
 * @param powerBar The HTML element representing the power bar.
 * @param side The side of the power bar ('left' or 'right').
 */
function drawPowerBar(value: number, powerBar: HTMLElement, side: string): void {
  powerBar.style.width = `${value}%`;

  if (value === 100) {
    if (
      (side === 'left' && !leftPowerBarAnimation) ||
      (side === 'right' && !rightPowerBarAnimation)
    )
      activatePowerBarAnimation(side);
    side === 'left' ? (leftPowerBarAnimation = true) : (rightPowerBarAnimation = true);
  } else {
    deactivatePowerBarAnimation(side);
    side === 'left' ? (leftPowerBarAnimation = false) : (rightPowerBarAnimation = false);
  }
}

/**
 * @brief Renders a goal and updates the score.
 * @param scoringSide The side that scored ('left' or 'right').
 */
function renderGoal(scoringSide: string) {
  let scorePoint: number;
  if (scoringSide === 'left') {
    leftSideGoal++;
    scorePoint = leftSideGoal;
  } else {
    rightSideGoal++;
    scorePoint = rightSideGoal;
  }

  const emptyScorePoint = document.getElementById(`${scoringSide}-score-card-${scorePoint}`);
  if (!emptyScorePoint) {
    console.warn(`No element found: ${scoringSide}-score-card-${scorePoint}`);
    return;
  }

  const colour = emptyScorePoint.className.match(/border-([a-z]+)-500/)?.[1];

  emptyScorePoint.classList.remove('border-2', `border-${colour}-500`);
  emptyScorePoint.classList.add(`bg-${colour}-500`);
}

/**
 * @brief Triggers animations based on the game state.
 * @param ctx The canvas rendering context.
 * @param state The current game state.
 */
function triggerAnimation(state: GameState) {
  if (state.leftAnimation) powerUpAnimation('left');
  if (state.rightAnimation) powerUpAnimation('right');
}

/**
 * @brief Triggers sound effects based on the game state.
 * @param ctx The canvas rendering context.
 * @param state The current game state.
 */
function triggerSound(ctx: CanvasRenderingContext2D, state: GameState) {}

/**
 * @brief Resets game-related variables to their initial state.
 */
function resetVariables(): void {
  leftSideGoal = 0;
  rightSideGoal = 0;
  leftPowerBarAnimation = false;
  rightPowerBarAnimation = false;
}
