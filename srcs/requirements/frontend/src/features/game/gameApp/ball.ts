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
		ctx.fillStyle = "black";
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
}
