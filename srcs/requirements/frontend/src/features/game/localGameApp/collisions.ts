import { wait } from '../../../utils/helpers.js';
import { gameState, SPEED, paintScore, fakeBalls, stats } from './game.js';
import { Player } from './player.js';
import { GameArea } from './types.js';
import { scoreAnimation } from '../animations/animations.js';
import { triggerEndGameMenu } from '../gameStats/gameConclusion.js';
import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { playType } from '../gameSettings/gameSettings.types.js';

/**
 * Maximum speed a ball can reach.
 */
export const MAX_BALL_SPEED: number = 1000;

let gameHasEnded: boolean = false;

let endGameMenuHasTriggered: boolean = false;

/**
 * Checks if the ball has collided with the horizontal walls of the canvas.
 * If a collision is detected, the ball's vertical direction is reversed.
 *
 * @param ball The ball object to check for collisions.
 * @param gameArea The game area containing the canvas.
 */
export function checkWallCollision(ball: Ball, gameArea: GameArea): void {
  const nudgeAmount = 1;

  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= gameArea.canvas.height) {
    ball.bounceVertical();
    if (ball.y - ball.radius <= 0 + nudgeAmount) ball.y = ball.radius + nudgeAmount;
    else ball.y = gameArea.canvas.height - ball.radius - nudgeAmount;
  }
}

/**
 * Checks if a fake ball has collided with the walls of the canvas.
 * Handles both horizontal and vertical wall collisions.
 *
 * @param ball The fake ball object to check for collisions.
 * @param gameArea The game area containing the canvas.
 */
export function checkFakeBallWallCollision(ball: Ball, gameArea: GameArea): void {
  const nudgeAmount = 1;

  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= gameArea.canvas.height) {
    ball.bounceVertical();
    if (ball.y - ball.radius <= 0 + nudgeAmount) ball.y = ball.radius + nudgeAmount;
    else ball.y = gameArea.canvas.height - ball.radius - nudgeAmount;
  }
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= gameArea.canvas.width) {
    ball.bounceHorizontalFakeBall();
    if (ball.x - ball.radius <= 0 + nudgeAmount) ball.x = ball.radius + nudgeAmount;
    else ball.x = gameArea.canvas.width - ball.radius - nudgeAmount;
  }
}

/**
 * Determines if either player has won the game by reaching the score limit.
 *
 * @param leftPlayer The left player object.
 * @param rightPlayer The right player object.
 * @returns True if either player has won, false otherwise.
 */
function eitherPlayerHasWon(leftPlayer: Player, rightPlayer: Player): boolean {
  gameHasEnded = leftPlayer.getScore() === 5 || rightPlayer.getScore() === 5;

  return gameHasEnded;
}

/**
 * Ends the game and triggers the end game menu for the winning player.
 *
 * @param winningPlayer The player who won the game.
 * @param gameArea The game area containing the canvas and game state.
 */
function endGame(
  winningPlayer: Player,
  gameArea: GameArea,
  playType: playType,
  tournamentIsRunning: boolean,
): void {
  gameArea.stop();
  gameArea.clear();
  if (!endGameMenuHasTriggered)
    triggerEndGameMenu(
      winningPlayer.side,
      winningPlayer.side,
      stats,
      playType,
      tournamentIsRunning,
    );
  endGameMenuHasTriggered = true;
}

/**
 * Checks if a goal has been scored by either player.
 * Updates scores, triggers animations, and resets the round if necessary.
 *
 * @param leftPlayer The left player object.
 * @param rightPlayer The right player object.
 * @param gameArea The game area containing the canvas and game state.
 */
export async function checkGoal(
  leftPlayer: Player,
  rightPlayer: Player,
  gameArea: GameArea,
  playType: playType,
  tournamentIsRunning: boolean,
): Promise<void> {
  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }
  if (leftPlayer.ball.x - leftPlayer.ball.radius <= 0) {
    rightPlayer.increaseScore();
    paintScore('right', rightPlayer.getScore());
    scoreAnimation('right');
    stats.right.increaseGoals();
    stats.left.increaseSufferedGoals();
    await resetRound(leftPlayer, rightPlayer, gameArea);
  } else if (leftPlayer.ball.x + leftPlayer.ball.radius >= gameArea.canvas.width) {
    leftPlayer.increaseScore();
    paintScore('left', leftPlayer.getScore());
    scoreAnimation('left');
    stats.left.increaseGoals();
    stats.right.increaseSufferedGoals();
    await resetRound(leftPlayer, rightPlayer, gameArea);
  }
  if (eitherPlayerHasWon(leftPlayer, rightPlayer)) {
    endGame(
      leftPlayer.getScore() > rightPlayer.getScore() ? leftPlayer : rightPlayer,
      gameArea,
      playType,
      tournamentIsRunning,
    );
  }
}

/**
 * Checks if the ball has crossed the paddle horizontally.
 *
 * @param ball The ball object.
 * @param paddle The paddle object.
 * @returns True if the ball has crossed the paddle horizontally, false otherwise.
 */
function crossedPaddleHorizontally(ball: Ball, paddle: Paddle): boolean {
  const goingLeft = ball.speedX < 0;
  const goingRight = ball.speedX > 0;

  if (goingLeft) {
    return (
      ball.previousX - ball.radius > paddle.x + paddle.width &&
      ball.x - ball.radius <= paddle.x + paddle.width
    );
  } else if (goingRight) {
    return ball.previousX + ball.radius < paddle.x && ball.x + ball.radius >= paddle.x;
  }

  return false;
}

/**
 * Checks if the ball is within the vertical range of the paddle.
 *
 * @param ball The ball object.
 * @param paddle The paddle object.
 * @returns True if the ball is within the paddle's height range, false otherwise.
 */
function isWithinPaddleHeight(ball: Ball, paddle: Paddle): boolean {
  return ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height;
}

/**
 * Limits the ball's speed to a specified maximum value.
 *
 * @param ball The ball object.
 * @param maxSpeed The maximum speed to enforce.
 */
function capMaxSpeed(ball: Ball, maxSpeed: number): void {
  if (Math.abs(ball.speedX) > maxSpeed) ball.speedX = Math.sign(ball.speedX) * maxSpeed;
  if (Math.abs(ball.speedY) > maxSpeed) ball.speedY = Math.sign(ball.speedY) * maxSpeed;
}

/**
 * Checks if the ball has collided with either paddle.
 * Adjusts the ball's position and speed if a collision is detected.
 *
 * @param ball The ball object.
 * @param leftPaddle The left paddle object.
 * @param rightPaddle The right paddle object.
 */
export function checkPaddleCollision(ball: Ball, leftPaddle: Paddle, rightPaddle: Paddle): void {
  if (
    // Left paddle collision
    crossedPaddleHorizontally(ball, leftPaddle) &&
    isWithinPaddleHeight(ball, leftPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    ball.bounceHorizontal(leftPaddle);
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    capMaxSpeed(ball, MAX_BALL_SPEED);
    stats.maxSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
    stats.left.increaseSaves();
  }

  if (
    // Right paddle collision
    crossedPaddleHorizontally(ball, rightPaddle) &&
    isWithinPaddleHeight(ball, rightPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    ball.bounceHorizontal(rightPaddle);
    ball.x = rightPaddle.x - ball.radius;
    capMaxSpeed(ball, MAX_BALL_SPEED);
    stats.maxSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
    stats.right.increaseSaves();
  }
}

/**
 * Resets the round by returning the ball and paddles to their initial positions.
 * Pauses the game briefly before resuming.
 *
 * @param leftPlayer The left player object.
 * @param rightPlayer The right player object.
 * @param gameArea The game area containing the canvas and game state.
 */
async function resetRound(leftPlayer: Player, rightPlayer: Player, gameArea: GameArea) {
  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }

  endGameMenuHasTriggered = false;
  const pauseEvent = new CustomEvent('paused');
  const beforeTime = Date.now();
  leftPlayer.ball.reset();
  leftPlayer.ownPaddle.reset();
  rightPlayer.ownPaddle.reset();
  fakeBalls.splice(0, fakeBalls.length);
  gameArea.inputHandler?.disable();
  window.dispatchEvent(pauseEvent);
  gameArea.state = gameState.paused;
  leftPlayer.ball.countdown();
  await wait(3);
  const newTime = Date.now();
  leftPlayer.attack?.reset(beforeTime, newTime);
  rightPlayer.attack?.reset(beforeTime, newTime);
  gameArea.inputHandler?.enable();
  gameArea.state = gameState.playing;
  leftPlayer.ball.speedX = SPEED * (Math.random() > 0.5 ? 1 : -1);
  leftPlayer.ball.speedY = SPEED * (Math.random() > 0.5 ? 1 : -1);
}
