import { CANVAS_HEIGHT, PADDLE_LEN, PADDLE_START_Y_POS } from './game.js';

export class Paddle {
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
  speedY: number;
  speedModifier: number;

  constructor(width: number, height: number, color: string, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedY = 0;
    this.speedModifier = 1;
  }

  // Draws the paddle on the canvas
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // Updates paddle position
  update(): void {
    this.y += this.speedY;
    // Clamp position within canvas bounds
    this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
  }

  setHeight(height: number): void {
    this.height = height;
  }

  setY(y: number): void {
    this.y = y;
  }

  setSpeedY(speedY: number): void {
    this.speedY = speedY;
  }

  setSpeedModifier(modifier: number): void {
    this.speedModifier = modifier;
  }

  reset(): void {
    this.y = PADDLE_START_Y_POS;
    this.speedY = 0;
    this.speedModifier = 1;
    this.height = PADDLE_LEN;
  }
}
