import { CANVAS_HEIGHT } from './game.js';

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

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	update(): void {
		this.y += this.speedY;

		// Clamp position within canvas bounds
		this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
	}
}
