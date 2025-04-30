import { CANVAS_HEIGHT, CANVAS_WIDTH, gameArea, gameState, SPEED } from './game.js';
import { Player } from './player.js';
import { Ball, ballCountdown } from './ball.js';
import { Paddle } from './paddle.js';
import { wait } from '../helpers.js';

export const MAX_BALL_SPEED: number = 1000;

// Checks if ball reached horizontal canvas limits
export function checkWallCollision(ball: Ball): void {
  const nudgeAmount = 1;
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= CANVAS_HEIGHT) {
    ball.bounceVertical();
    if (ball.y - ball.radius <= 0 + nudgeAmount) ball.y = ball.radius + nudgeAmount;
    else ball.y = CANVAS_HEIGHT - ball.radius - nudgeAmount;
  }
}

export function checkFakeBallWallCollision(ball: Ball): void {
  const nudgeAmount = 1;
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= CANVAS_HEIGHT) {
    ball.bounceVertical();
    if (ball.y - ball.radius <= 0 + nudgeAmount) ball.y = ball.radius + nudgeAmount;
    else ball.y = CANVAS_HEIGHT - ball.radius - nudgeAmount;
  }
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= CANVAS_WIDTH) {
    ball.bounceHorizontalFakeBall();
    if (ball.x - ball.radius <= 0 + nudgeAmount) ball.x = ball.radius + nudgeAmount;
    else ball.x = CANVAS_WIDTH - ball.radius - nudgeAmount;
  }
}

function eitherPlayerHasWon(leftPlayer: Player, rightPlayer: Player): boolean {
  return leftPlayer.getScore() === 5 || rightPlayer.getScore() === 5;
}

function endGame(winningPlayer: Player, gameArea: gameArea): void {
  gameArea.stop();
  gameArea.broadcastMessage('game_end');
}

// Checks if ball reached vertical canvas limits
export async function checkGoal(gameArea: gameArea) {
  if (gameArea.leftPlayer.ball.x - gameArea.leftPlayer.ball.radius <= 0) {
    gameArea.rightPlayer.increaseScore();
    // paintScore('right', gameArea.rightPlayer.getScore());
    // scoreAnimation('right');
    gameArea.stats.right.increaseGoals();
    gameArea.stats.left.increaseSufferedGoals();
    await resetRound(gameArea);
  } else if (gameArea.leftPlayer.ball.x + gameArea.leftPlayer.ball.radius >= CANVAS_WIDTH) {
    gameArea.leftPlayer.increaseScore();
    // paintScore('left', gameArea.leftPlayer.getScore());
    // scoreAnimation('left');
    gameArea.stats.left.increaseGoals();
    gameArea.stats.right.increaseSufferedGoals();
    await resetRound(gameArea);
  }
  if (eitherPlayerHasWon(gameArea.leftPlayer, gameArea.rightPlayer))
    endGame(
      gameArea.leftPlayer.getScore() > gameArea.rightPlayer.getScore()
        ? gameArea.leftPlayer
        : gameArea.rightPlayer,
      gameArea,
    );
}

// Checks if ball went over paddle x coordinate
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

// Check if ball is within paddle y range
function isWithinPaddleHeight(ball: Ball, paddle: Paddle): boolean {
  return ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height;
}

// Limits ball speed to maxSpeed
function capMaxSpeed(ball: Ball, maxSpeed: number): void {
  if (Math.abs(ball.speedX) > maxSpeed) ball.speedX = Math.sign(ball.speedX) * maxSpeed;
  if (Math.abs(ball.speedY) > maxSpeed) ball.speedY = Math.sign(ball.speedY) * maxSpeed;
}

// Checks if ball collided with either paddle
export function checkPaddleCollision(gameArea: gameArea): void {
  if (
    // Left paddle collision
    crossedPaddleHorizontally(gameArea.ball, gameArea.leftPaddle) &&
    isWithinPaddleHeight(gameArea.ball, gameArea.leftPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    gameArea.ball.bounceHorizontal(gameArea.leftPaddle);
    gameArea.ball.x = gameArea.leftPaddle.x + gameArea.leftPaddle.width + gameArea.ball.radius;
    capMaxSpeed(gameArea.ball, MAX_BALL_SPEED);
    gameArea.stats.maxSpeed = Math.sqrt(gameArea.ball.speedX ** 2 + gameArea.ball.speedY ** 2);
    gameArea.stats.left.increaseSaves();
  }

  if (
    // Right paddle collision
    crossedPaddleHorizontally(gameArea.ball, gameArea.rightPaddle) &&
    isWithinPaddleHeight(gameArea.ball, gameArea.rightPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    gameArea.ball.bounceHorizontal(gameArea.rightPaddle);
    gameArea.ball.x = gameArea.rightPaddle.x - gameArea.ball.radius;
    capMaxSpeed(gameArea.ball, MAX_BALL_SPEED);
    gameArea.stats.maxSpeed = Math.sqrt(gameArea.ball.speedX ** 2 + gameArea.ball.speedY ** 2);
    gameArea.stats.right.increaseSaves();
  }
}

// Returns ball to center of canvas and starts round at random direction
async function resetRound(gameArea: gameArea) {
  const beforeTime = Date.now();
  gameArea.leftPlayer.ball.reset();
  gameArea.leftPlayer.ownPaddle.reset();
  gameArea.rightPlayer.ownPaddle.reset();
  gameArea.fakeBalls.splice(0, gameArea.fakeBalls.length);
  gameArea.state = gameState.paused;
  ballCountdown();
  await wait(3);
  const newTime = Date.now();
  gameArea.leftPlayer.attack?.reset(beforeTime, newTime);
  gameArea.rightPlayer.attack?.reset(beforeTime, newTime);
  gameArea.state = gameState.playing;
  gameArea.leftPlayer.ball.speedX = SPEED * (Math.random() > 0.5 ? 1 : -1);
  gameArea.leftPlayer.ball.speedY = SPEED * (Math.random() > 0.5 ? 1 : -1);
}
