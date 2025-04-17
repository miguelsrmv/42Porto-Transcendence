import { Paddle } from "./paddle.js";
import { Ball } from "./ball.js";
import { setupInput, handleInput } from "./input.js";
import {
  checkWallCollision,
  checkPaddleCollision,
  checkGoal,
} from "./collisions.js";
import { GameArea } from "./types.js";

//TODO: Check if SPEED is hardcoded somewhere else

export const SPEED = 15;
export const CANVAS_HEIGHT = 720;
const CANVAS_WIDTH = 1200;
const PADDLE_LEN = CANVAS_HEIGHT * 0.2;
const PADDLE_WID = 10;
const PADDLE_START_Y_POS = CANVAS_HEIGHT / 2 - PADDLE_LEN / 2;
const BALL_RADIUS = 10;

let rightPaddle: Paddle;
let leftPaddle: Paddle;
let ball: Ball;

const myGameArea: GameArea = {
  canvas: null,
  context: null,
  interval: undefined,

  start() {
    this.canvas = document.getElementById(
      "game-canvas"
    ) as HTMLCanvasElement | null;

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

    const pongPage = document.getElementById("game-container");
    if (pongPage && this.canvas) {
      pongPage.insertBefore(this.canvas, pongPage.firstChild);
    } else {
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

export function initializeGame(): void {
  const pongPage = document.getElementById(
    "game-container"
  ) as HTMLElement | null;

  if (!pongPage) {
    console.error("Cannot start the game: game-container is missing.");
    return;
  }
  rightPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    "black",
    CANVAS_WIDTH - 20,
    PADDLE_START_Y_POS
  );
  leftPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    "black",
    PADDLE_WID,
    PADDLE_START_Y_POS
  );
  ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, SPEED);

  setupInput();
  myGameArea.start();
}

function updateGameArea(): void {
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

function paintBackground(context : CanvasRenderingContext2D): void {

  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

  const backgroundImg = new Image();
  backgroundImg.src = "../../../../static/backgrounds/Backyard.png"; // Replace with your image path

  backgroundImg.onload = () => {
    context?.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height); // Draw image to fill canvas
  };
}