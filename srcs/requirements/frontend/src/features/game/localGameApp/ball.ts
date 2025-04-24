import { BALL_RADIUS, CANVAS_HEIGHT, CANVAS_WIDTH } from './game.js';
import { Paddle } from './paddle.js';

const BALL_COLOUR = 'white';

export class Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;

  constructor(x: number, y: number, radius: number, speedX: number, speedY: number) {
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = BALL_COLOUR;
    ctx.fill();
    ctx.closePath();
  }

  move(dt: number): void {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
  }

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

  bounceHorizontalFakeBall(): void {
    this.speedX *= -1; // Reverse horizontal direction
  }

  bounceVertical(): void {
    this.speedY *= -1; // Reverse vertical direction
  }

  setSpeed(x: number, y: number): void {
    this.speedX = x;
    this.speedY = y;
  }

  setRadius(radius: number): void {
    this.radius = radius;
  }

  reset(): void {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.speedX = 0;
    this.speedY = 0;
    this.radius = BALL_RADIUS;
  }
}
