import { BALL_RADIUS, CANVAS_HEIGHT, CANVAS_WIDTH } from './game.js';
import { Paddle } from './paddle.js';

/**
 * @file ball.ts
 * @brief Defines the Ball class and related functionality for a game, including movement, bouncing, and resetting.
 */

let BALL_COLOUR = 'white';
const BORDER_COLOUR = 'gray';
let isVisible = true;

/**
 * @class Ball
 * @brief Represents a ball in the game, with properties for position, speed, and radius.
 */
export class Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;

  /**
   * @brief Constructs a new Ball object.
   * @param x The initial x-coordinate of the ball.
   * @param y The initial y-coordinate of the ball.
   * @param radius The radius of the ball.
   * @param speedX The initial horizontal speed of the ball.
   * @param speedY The initial vertical speed of the ball.
   */
  constructor(x: number, y: number, radius: number, speedX: number, speedY: number) {
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  /**
   * @brief Draws the ball on the canvas.
   * @param ctx The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (isVisible) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = BALL_COLOUR;
      ctx.fill();
      ctx.strokeStyle = BORDER_COLOUR;
      ctx.stroke();
      ctx.closePath();
    }
  }

  /**
   * @brief Moves the ball based on its speed and the elapsed time.
   * @param dt The time delta in seconds.
   */
  move(dt: number): void {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
  }

  /**
   * @brief Handles horizontal bouncing when the ball collides with a paddle.
   * @param paddle The paddle object the ball collides with.
   */
  bounceHorizontal(paddle: Paddle): void {
    // NOTE: Old implementation!
    // this.speedX *= -1; // Reverse horizontal direction

    // NOTE: Check how this feels!
    // --- Correctly Calculate Paddle Center Y ---
    const paddleCenterY = paddle.y + paddle.height / 2.0; // Calculate the actual center

    // --- 1. Calculate Relative Intersection & Normalize (Use paddleCenterY) ---
    const relativeIntersectY = this.y - paddleCenterY; // Use the calculated center
    const normalizedRelativeIntersectionY = Math.max(
      -1,
      Math.min(1, relativeIntersectY / (paddle.height / 2.0)),
    );

    // --- 2. Calculate Bounce Angle ---
    const maxBounceAngle = (60 * Math.PI) / 180; // 60 degrees in radians, correspondes to maximum steepness
    const bounceAngle = normalizedRelativeIntersectionY * maxBounceAngle;

    // --- 3. Calculate Speed Magnitude (10% overall speed increase) ---
    const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
    const newSpeed = speed * 1.1;

    // --- 4. Determine Outgoing Horizontal Direction ---
    const newSpeedXSign = this.speedX > 0 ? -1 : 1;

    // --- 5. Set New Velocities ---
    this.speedX = newSpeedXSign * newSpeed * Math.cos(bounceAngle);
    this.speedY = newSpeed * Math.sin(bounceAngle); // Sign now correctly determined by bounceAngle
  }

  /**
   * @brief Handles a simple horizontal bounce for a fake ball.
   */
  bounceHorizontalFakeBall(): void {
    this.speedX *= -1; // Reverse horizontal direction
  }

  /**
   * @brief Handles vertical bouncing when the ball collides with a horizontal surface.
   */
  bounceVertical(): void {
    this.speedY *= -1; // Reverse vertical direction
  }

  /**
   * @brief Sets the speed of the ball.
   * @param x The new horizontal speed.
   * @param y The new vertical speed.
   */
  setSpeed(x: number, y: number): void {
    this.speedX = x;
    this.speedY = y;
  }

  /**
   * @brief Sets the radius of the ball.
   * @param radius The new radius of the ball.
   */
  setRadius(radius: number): void {
    this.radius = radius;
  }

  /**
   * @brief Resets the ball to its initial position, speed, and radius.
   */
  reset(): void {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.speedX = 0;
    this.speedY = 0;
    this.radius = BALL_RADIUS;
  }
}

/**
 * @brief Toggles the visibility of the ball for a countdown effect.
 *        The ball blinks for 3 seconds (6 toggles) before becoming visible.
 */
export function ballCountdown() {
  let count: number = 0;

  const interval = setInterval(() => {
    isVisible = !isVisible;
    count++;

    if (count >= 6) {
      clearInterval(interval);
    }
  }, 500);
}
