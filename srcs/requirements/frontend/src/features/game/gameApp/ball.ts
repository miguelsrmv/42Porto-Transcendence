import { wait } from '../../../utils/helpers.js';

const BALL_COLOUR = 'white';

export class Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;

  constructor(x: number, y: number, radius: number, speed: number) {
    this.x = x;
    this.y = y;
    this.previousX = x;
    this.previousY = y;
    this.radius = radius;
    this.speedX = speed;
    this.speedY = speed;
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

  async increaseSpeed(factor: number): Promise<void> {
    let startingSpeed = this.speedX;

    console.log(`I started at ${this.speedX}`);

    if (this.speedX >= 0) this.speedX + factor < 20 ? (this.speedX += factor) : (this.speedX = 20);
    else this.speedX - factor > -20 ? (this.speedX -= factor) : (this.speedX = -20);

    if (this.speedY >= 0) this.speedY + factor < 20 ? (this.speedY += factor) : (this.speedY = 20);
    else this.speedY - factor > -20 ? (this.speedY -= factor) : (this.speedY = -20);

    console.log(`I increased to ${this.speedX}`);

    await wait(2);

    if (this.speedX > 0) {
      this.speedX = Math.abs(startingSpeed);
    } else {
      this.speedX = -Math.abs(startingSpeed);
    }

    if (this.speedY > 0) {
      this.speedY = Math.abs(startingSpeed);
    } else {
      this.speedY = -Math.abs(startingSpeed);
    }

    console.log(`I'm back at ${this.speedX}`);
  }
}
