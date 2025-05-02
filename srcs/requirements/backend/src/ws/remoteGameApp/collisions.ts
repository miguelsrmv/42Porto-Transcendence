import { Ball, ballCountdown } from './ball.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, GameArea, SPEED } from './gameArea.js';
import { wait } from './helpers.js';
import { Paddle } from './paddle.js';
import { Player } from './player.js';
import { gameRunningState, ServerMessage } from './types.js';

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

function endGame(winningPlayer: Player, GameArea: GameArea): void {
  GameArea.stop();
  const gameEndMsg = {
    type: 'game_end',
    winningPlayer: winningPlayer.side,
    stats: GameArea.stats,
  } as ServerMessage;
  // TODO: Separate message to each player?
  GameArea.broadcastSessionMessage(JSON.stringify(gameEndMsg));
}

// Checks if ball reached vertical canvas limits
export async function checkGoal(GameArea: GameArea) {
  if (GameArea.leftPlayer.ball.x - GameArea.leftPlayer.ball.radius <= 0) {
    GameArea.rightPlayer.increaseScore();
    GameArea.stats.right.increaseGoals();
    GameArea.stats.left.increaseSufferedGoals();
    const gameGoal: ServerMessage = { type: 'game_goal', scoringSide: 'right' };
    GameArea.broadcastSessionMessage(JSON.stringify(gameGoal));
    await resetRound(GameArea);
  } else if (GameArea.leftPlayer.ball.x + GameArea.leftPlayer.ball.radius >= CANVAS_WIDTH) {
    GameArea.leftPlayer.increaseScore();
    GameArea.stats.left.increaseGoals();
    GameArea.stats.right.increaseSufferedGoals();
    const gameGoal: ServerMessage = { type: 'game_goal', scoringSide: 'left' };
    GameArea.broadcastSessionMessage(JSON.stringify(gameGoal));
    await resetRound(GameArea);
  }
  if (eitherPlayerHasWon(GameArea.leftPlayer, GameArea.rightPlayer))
    endGame(
      GameArea.leftPlayer.getScore() > GameArea.rightPlayer.getScore()
        ? GameArea.leftPlayer
        : GameArea.rightPlayer,
      GameArea,
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
export function checkPaddleCollision(GameArea: GameArea): void {
  if (
    // Left paddle collision
    crossedPaddleHorizontally(GameArea.ball, GameArea.leftPaddle) &&
    isWithinPaddleHeight(GameArea.ball, GameArea.leftPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    GameArea.ball.bounceHorizontal(GameArea.leftPaddle);
    GameArea.ball.x = GameArea.leftPaddle.x + GameArea.leftPaddle.width + GameArea.ball.radius;
    capMaxSpeed(GameArea.ball, MAX_BALL_SPEED);
    GameArea.stats.maxSpeed = Math.sqrt(GameArea.ball.speedX ** 2 + GameArea.ball.speedY ** 2);
    GameArea.stats.left.increaseSaves();
  }

  if (
    // Right paddle collision
    crossedPaddleHorizontally(GameArea.ball, GameArea.rightPaddle) &&
    isWithinPaddleHeight(GameArea.ball, GameArea.rightPaddle)
  ) {
    // Adjustment to prevent sticking to paddle
    GameArea.ball.bounceHorizontal(GameArea.rightPaddle);
    GameArea.ball.x = GameArea.rightPaddle.x - GameArea.ball.radius;
    capMaxSpeed(GameArea.ball, MAX_BALL_SPEED);
    GameArea.stats.maxSpeed = Math.sqrt(GameArea.ball.speedX ** 2 + GameArea.ball.speedY ** 2);
    GameArea.stats.right.increaseSaves();
  }
}

// Returns ball to center of canvas and starts round at random direction
async function resetRound(GameArea: GameArea) {
  const beforeTime = Date.now();
  GameArea.leftPlayer.ball.reset();
  GameArea.leftPlayer.ownPaddle.reset();
  GameArea.rightPlayer.ownPaddle.reset();
  GameArea.fakeBalls.splice(0, GameArea.fakeBalls.length);
  GameArea.runningState = gameRunningState.paused;
  ballCountdown(GameArea.ball);
  await wait(3);
  const newTime = Date.now();
  GameArea.leftAnimation = false;
  GameArea.rightAnimation = false;
  GameArea.leftPlayer.attack?.reset(beforeTime, newTime);
  GameArea.rightPlayer.attack?.reset(beforeTime, newTime);
  GameArea.runningState = gameRunningState.playing;
  GameArea.leftPlayer.ball.speedX = SPEED * (Math.random() > 0.5 ? 1 : -1);
  GameArea.leftPlayer.ball.speedY = SPEED * (Math.random() > 0.5 ? 1 : -1);
}
