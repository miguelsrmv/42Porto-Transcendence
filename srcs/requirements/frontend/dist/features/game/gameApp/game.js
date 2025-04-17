import { Paddle } from "./paddle.js";
import { Ball } from "./ball.js";
import { setupInput, handleInput } from "./input.js";
import { checkWallCollision, checkPaddleCollision, checkGoal, } from "./collisions.js";
export const SPEED = 3;
export const CANVAS_HEIGHT = 270;
const CANVAS_WIDTH = 480;
const PADDLE_LEN = CANVAS_HEIGHT * 0.2;
const PADDLE_WID = 10;
const PADDLE_START_Y_POS = CANVAS_HEIGHT / 2 - PADDLE_LEN / 2;
const BALL_RADIUS = 6;
let rightPaddle;
let leftPaddle;
let ball;
const myGameArea = {
    canvas: null,
    context: null,
    interval: undefined,
    start() {
        this.canvas = document.getElementById("game-canvas");
        if (!this.canvas) {
            console.error("No game-canvas present");
            return;
        }
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        if (!this.context) {
            console.error("No canvas context available");
            return;
        }
        const pongPage = document.getElementById("game-template");
        if (pongPage && this.canvas) {
            pongPage.insertBefore(this.canvas, pongPage.firstChild);
        }
        else {
            console.error("Pong page not found or canvas is null!");
        }
        this.interval = window.setInterval(updateGameArea, 20);
    },
    clear() {
        if (this.context && this.canvas) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    stop() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    },
};
export function initializeGame() {
    const pongPage = document.getElementById("game-template");
    if (!pongPage) {
        console.error("Cannot start the game: game-template is missing.");
        return;
    }
    rightPaddle = new Paddle(PADDLE_WID, PADDLE_LEN, "white", CANVAS_WIDTH - 20, PADDLE_START_Y_POS);
    leftPaddle = new Paddle(PADDLE_WID, PADDLE_LEN, "white", PADDLE_WID, PADDLE_START_Y_POS);
    ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, SPEED);
    setupInput();
    myGameArea.start();
}
function updateGameArea() {
    myGameArea.clear();
    handleInput(leftPaddle, rightPaddle);
    leftPaddle.update();
    rightPaddle.update();
    ball.move();
    if (!myGameArea.canvas) {
        console.error("Error getting canvas element!");
        return;
    }
    checkWallCollision(ball, myGameArea);
    checkPaddleCollision(ball, leftPaddle, rightPaddle);
    checkGoal(ball, myGameArea);
    if (myGameArea.context) {
        leftPaddle.draw(myGameArea.context);
        rightPaddle.draw(myGameArea.context);
        ball.draw(myGameArea.context);
    }
}
//# sourceMappingURL=game.js.map