import { CANVAS_HEIGHT } from './game.js';
import { wait } from '../../../utils/helpers.js';

export class Paddle {
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
  speedY: number;

  constructor(width: number, height: number, color: string, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedY = 0;
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

  async increaseHeight(factor: number): Promise<void> {
    let startingHeight = this.height;
    let newHeight = this.height * factor;

    this.height = newHeight;
    let currentPosition = this.y;
    this.y -= (newHeight - startingHeight) / 2;

    await wait(2);

    this.height = startingHeight;
    currentPosition = this.y;
    this.y += (newHeight - startingHeight) / 2;
  }
}
