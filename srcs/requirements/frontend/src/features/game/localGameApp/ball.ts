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

  move(): void {
    this.previousX = this.x;
    this.previousY = this.y;
    this.x += this.speedX;
    this.y += this.speedY;
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
    const maxBounceAngle = (75 * Math.PI) / 180; // 75 degrees in radians
    const bounceAngle = normalizedRelativeIntersectionY * maxBounceAngle;

    // --- 3. Calculate Speed Magnitude (No Increase) ---
    const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);

    // --- 4. Determine Outgoing Horizontal Direction ---
    const newSpeedXSign = this.speedX > 0 ? -1 : 1;

    // --- 5. Set New Velocities ---
    this.speedX = newSpeedXSign * speed * Math.cos(bounceAngle);
    this.speedY = speed * Math.sin(bounceAngle); // Sign now correctly determined by bounceAngle
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
