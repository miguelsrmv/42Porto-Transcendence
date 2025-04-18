import { SPEED } from "./game.js";
import { GameArea } from "./types.js";

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
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function checkWallCollision(ball: Ball, gameArea: GameArea): void {
  if (!gameArea.canvas) {
    console.error("Error getting canvas element!");
    return;
  }
  if (
    ball.y - ball.radius <= 0 ||
    ball.y + ball.radius >= gameArea.canvas.height
  ) {
    ball.bounceVertical();
  }
}

function crossedPaddleHorizontally(ball: Ball, paddle: Paddle): boolean {
  const goingLeft = ball.speedX < 0;
  const goingRight = ball.speedX > 0;

  if (goingLeft) {
    return (
      ball.previousX - ball.radius > paddle.x + paddle.width &&
      ball.x - ball.radius <= paddle.x + paddle.width
    );
  } else if (goingRight) {
    return (
      ball.previousX + ball.radius < paddle.x &&
      ball.x + ball.radius >= paddle.x
    );
  }

  return false;
}

// Check if ball is within paddle y range
function isWithinPaddleHeight(ball: Ball, paddle: Paddle): boolean {
  return (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height
  );
}

// Limits ball speed to maxSpeed
function capMaxSpeed(ball: Ball, maxSpeed: number): void {
  if (Math.abs(ball.speedX) > maxSpeed)
    ball.speedX = Math.sign(ball.speedX) * maxSpeed;
  if (Math.abs(ball.speedY) > maxSpeed)
    ball.speedY = Math.sign(ball.speedY) * maxSpeed;
}

export function checkPaddleCollision(
  ball: Ball,
  leftPaddle: Paddle,
  rightPaddle: Paddle
): void {
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

export function checkGoal(ball: Ball, gameArea: GameArea): void {
  if (!gameArea.canvas) {
    console.error("Error getting canvas element!");
    return;
  }
  if (ball.x - ball.radius <= 0) {
    console.log("Goal for Player 2!");
    resetBall(ball, gameArea);
  } else if (ball.x + ball.radius >= gameArea.canvas.width) {
    console.log("Goal for Player 1!");
    resetBall(ball, gameArea);
  }
}

function resetBall(ball: Ball, gameArea: GameArea): void {
  if (!gameArea.canvas) {
    console.error("Error getting canvas element!");
    return;
  }
  ball.x = gameArea.canvas.width / 2;
  ball.y = gameArea.canvas.height / 2;
  ball.speedX = SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.speedY = SPEED * (Math.random() > 0.5 ? 1 : -1);
}
