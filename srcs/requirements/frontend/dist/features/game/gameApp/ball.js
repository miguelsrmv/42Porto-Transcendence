export class Ball {
    x;
    y;
    radius;
    speedX;
    speedY;
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
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