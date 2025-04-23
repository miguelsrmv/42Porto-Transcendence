import { BALL_RADIUS, CANVAS_HEIGHT, CANVAS_WIDTH } from './game.js';
const BALL_COLOUR = 'white';
export class Ball {
    x;
    y;
    previousX;
    previousY;
    radius;
    speedX;
    speedY;
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.previousX = x;
        this.previousY = y;
        this.radius = radius;
        this.speedX = speed;
        this.speedY = speed;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = BALL_COLOUR;
        ctx.fill();
        ctx.closePath();
    }
    move() {
        this.previousX = this.x;
        this.previousY = this.y;
        this.x += this.speedX;
        this.y += this.speedY;
    }
    bounceHorizontal() {
        this.speedX *= -1; // Reverse horizontal direction
    }
    bounceVertical() {
        this.speedY *= -1; // Reverse vertical direction
    }
    setSpeed(x, y) {
        this.speedX = x;
        this.speedY = y;
    }
    setRadius(radius) {
        this.radius = radius;
    }
    reset() {
        this.x = CANVAS_WIDTH / 2;
        this.y = CANVAS_HEIGHT / 2;
        this.speedX = 0;
        this.speedY = 0;
        this.radius = BALL_RADIUS;
    }
}
//# sourceMappingURL=ball.js.map