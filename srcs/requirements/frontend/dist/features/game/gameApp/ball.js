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
        ctx.fillStyle = "black";
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
}
//# sourceMappingURL=ball.js.map