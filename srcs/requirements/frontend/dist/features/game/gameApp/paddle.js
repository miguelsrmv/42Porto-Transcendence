import { CANVAS_HEIGHT, PADDLE_LEN, PADDLE_START_Y_POS } from './game.js';
export class Paddle {
    width;
    height;
    color;
    x;
    y;
    speedY;
    speedModifier;
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedY = 0;
        this.speedModifier = 1;
    }
    // Draws the paddle on the canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    // Updates paddle position
    update() {
        this.y += this.speedY;
        // Clamp position within canvas bounds
        this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
    }
    setHeight(height) {
        this.height = height;
    }
    setY(y) {
        this.y = y;
    }
    setSpeedY(speedY) {
        this.speedY = speedY;
    }
    setSpeedModifier(modifier) {
        this.speedModifier = modifier;
    }
    reset() {
        this.y = PADDLE_START_Y_POS;
        this.speedY = 0;
        this.speedModifier = 1;
        this.height = PADDLE_LEN;
    }
}
//# sourceMappingURL=paddle.js.map