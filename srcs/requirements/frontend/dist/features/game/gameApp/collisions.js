import { SPEED } from "./game.js";
export function checkWallCollision(ball, gameArea) {
    if (!gameArea.canvas) {
        console.error("Error getting canvas element!");
        return;
    }
    if (ball.y - ball.radius <= 0 ||
        ball.y + ball.radius >= gameArea.canvas.height) {
        ball.bounceVertical();
    }
}
export function checkPaddleCollision(ball, leftPaddle, rightPaddle) {
    // Left paddle collision
    if (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
        ball.y >= leftPaddle.y - ball.radius &&
        ball.y <= leftPaddle.y + leftPaddle.height + ball.radius) {
        ball.bounceHorizontal();
        ball.speedX *= 1.1;
    }
    // Right paddle collision
    if (ball.x + ball.radius >= rightPaddle.x &&
        ball.y >= rightPaddle.y - ball.radius &&
        ball.y <= rightPaddle.y + rightPaddle.height + ball.radius) {
        ball.bounceHorizontal();
        ball.speedX *= 1.1;
    }
}
export function checkGoal(ball, gameArea) {
    if (!gameArea.canvas) {
        console.error("Error getting canvas element!");
        return;
    }
    if (ball.x - ball.radius <= 0) {
        console.log("Goal for Player 2!");
        resetBall(ball, gameArea);
    }
    else if (ball.x + ball.radius >= gameArea.canvas.width) {
        console.log("Goal for Player 1!");
        resetBall(ball, gameArea);
    }
}
function resetBall(ball, gameArea) {
    if (!gameArea.canvas) {
        console.error("Error getting canvas element!");
        return;
    }
    ball.x = gameArea.canvas.width / 2;
    ball.y = gameArea.canvas.height / 2;
    ball.speedX = SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = SPEED * (Math.random() > 0.5 ? 1 : -1);
}
//# sourceMappingURL=collisions.js.map