import { CANVAS_HEIGHT } from './game.js';
export class Paddle {
    width;
    height;
    color;
    x;
    y;
    speedY;
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedY = 0;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.y += this.speedY;
        // Clamp position within canvas bounds
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
    }
}
//# sourceMappingURL=paddle.js.map