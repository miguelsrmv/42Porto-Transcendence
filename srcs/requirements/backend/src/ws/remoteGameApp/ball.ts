import { BALL_RADIUS, CANVAS_HEIGHT, CANVAS_WIDTH } from './gameArea.js';
import { Paddle } from './paddle.js';

/**
 * @file ball.ts
 * @brief This file contains the Ball class which represents a ball in the game.
 */

/**
 * @class Ball
 * @brief Represents a ball in the game.
 */
export class Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;
  isVisible: boolean;

  /**
   * @brief Constructs a new Ball object.
   * @param x Initial x position.
   * @param y Initial y position.
   * @param radius Radius of the ball.
   * @param speedX Initial horizontal speed.
   * @param speedY Initial vertical speed.
   */
  constructor(x: number, y: number, radius: number, speedX: number, speedY: number) {
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.isVisible = true;
  }

  /**
   * @brief Moves the ball based on its speed and the time delta.
   * @param dt Time delta for movement calculation.
   */
  move(dt: number): void {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
  }

  /**
   * @brief Handles the horizontal bounce of the ball when it hits a paddle.
   * @param paddle The paddle that the ball collides with.
   */
  bounceHorizontal(paddle: Paddle): void {
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
   * @brief Simulates a horizontal bounce for a fake ball.
   */
  bounceHorizontalFakeBall(): void {
    this.speedX *= -1; // Reverse horizontal direction
  }

  /**
   * @brief Reverses the vertical direction of the ball.
   */
  bounceVertical(): void {
    this.speedY *= -1; // Reverse vertical direction
  }

  /**
   * @brief Sets the speed of the ball.
   * @param x New horizontal speed.
   * @param y New vertical speed.
   */
  setSpeed(x: number, y: number): void {
    this.speedX = x;
    this.speedY = y;
  }

  /**
   * @brief Sets the radius of the ball.
   * @param radius New radius.
   */
  setRadius(radius: number): void {
    this.radius = radius;
  }

  /**
   * @brief Resets the ball to the center of the canvas with default speed and radius.
   */
  reset(): void {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.speedX = 0;
    this.speedY = 0;
    this.radius = BALL_RADIUS;
    this.isVisible = true;
  }

  /**
   * @brief Changes the ball's visibility
   */
  setIsVisible(visibility: boolean) {
    this.isVisible = visibility;
  }

  /**
   * @brief Creates ball countdown
   */
  countdown() {
    let count: number = 0;

    const interval = setInterval(() => {
      this.isVisible = !this.isVisible;
      count++;

      if (count >= 6) {
        clearInterval(interval);
      }
    }, 500);
  }
}
