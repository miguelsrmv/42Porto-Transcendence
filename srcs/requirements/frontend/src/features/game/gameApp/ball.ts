import { wait } from '../../../utils/helpers.js';
import { BALL_RADIUS, CANVAS_HEIGHT, CANVAS_WIDTH } from './game.js';

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

  bounceHorizontal(): void {
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
