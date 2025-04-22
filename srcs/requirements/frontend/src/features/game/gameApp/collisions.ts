import { wait } from '../../../utils/helpers.js';
import { gameState, SPEED, paintScore } from './game.js';
import { Player } from './player.js';
import { GameArea } from './types.js';

interface Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;
  bounceVertical(): void;
  bounceHorizontal(): void;
  reset(): void;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Checks if ball reached horizontal canvas limits
export function checkWallCollision(ball: Ball, gameArea: GameArea): void {
  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }
  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= gameArea.canvas.height) {
    ball.bounceVertical();
  }
}

// TODO: Get winning score from settings ?
function eitherPlayerHasWon(leftPlayer: Player, rightPlayer: Player): boolean {
  return leftPlayer.getScore() === 5 || rightPlayer.getScore() === 5;
}

function endGame(winningPlayer: Player, gameArea: GameArea) {
  window.alert(`${winningPlayer.alias} has won!`);
  gameArea.stop();
}

// Checks if ball reached vertical canvas limits
// TODO: Paint scores in HTML
export async function checkGoal(leftPlayer: Player, rightPlayer: Player, gameArea: GameArea) {
  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }
  if (leftPlayer.ball.x - leftPlayer.ball.radius <= 0) {
    rightPlayer.increaseScore();
    paintScore('right', rightPlayer.getScore());
    console.log(`Right player now has: ${rightPlayer.getScore()} points`);
    await resetRound(leftPlayer, rightPlayer, gameArea);
  } else if (leftPlayer.ball.x + leftPlayer.ball.radius >= gameArea.canvas.width) {
    leftPlayer.increaseScore();
    paintScore('left', leftPlayer.getScore());
    console.log(`Left player now has: ${leftPlayer.getScore()} points`);
    await resetRound(leftPlayer, rightPlayer, gameArea);
  }
  if (eitherPlayerHasWon(leftPlayer, rightPlayer))
    endGame(leftPlayer.getScore() > rightPlayer.getScore() ? leftPlayer : rightPlayer, gameArea);
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
export function checkPaddleCollision(ball: Ball, leftPaddle: Paddle, rightPaddle: Paddle): void {
  if (
    // Left paddle collision
    crossedPaddleHorizontally(ball, leftPaddle) &&
    isWithinPaddleHeight(ball, leftPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    ball.bounceHorizontal();
    ball.speedX *= 1.1;
    capMaxSpeed(ball, 20);
  }

  if (
    // Right paddle collision
    crossedPaddleHorizontally(ball, rightPaddle) &&
    isWithinPaddleHeight(ball, rightPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    ball.x = rightPaddle.x - ball.radius;
    ball.bounceHorizontal();
    ball.speedX *= 1.1;
    capMaxSpeed(ball, 20);
  }
}

// TODO: Add countdown
// Returns ball to center of canvas and starts round at random direction
async function resetRound(leftPlayer: Player, rightPlayer: Player, gameArea: GameArea) {
  if (!gameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }

  const pauseEvent = new CustomEvent('paused');
  leftPlayer.ball.reset();
  leftPlayer.ownPaddle.reset();
  rightPlayer.ownPaddle.reset();
  gameArea.inputHandler?.disable();
  window.dispatchEvent(pauseEvent);
  gameArea.state = gameState.paused;
  await wait(2);
  leftPlayer.attack?.reset();
  rightPlayer.attack?.reset();
  gameArea.inputHandler?.enable();
  gameArea.state = gameState.playing;
  leftPlayer.ball.speedX = SPEED * (Math.random() > 0.5 ? 1 : -1);
  leftPlayer.ball.speedY = SPEED * (Math.random() > 0.5 ? 1 : -1);
}
