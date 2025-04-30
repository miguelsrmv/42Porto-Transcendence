import {
  activatePowerBarAnimation,
  deactivatePowerBarAnimation,
  powerUpAnimation,
} from '../animations/animations.js';
import type { GameArea, GameState, Paddle, Ball } from './remoteGameTypes.js';

const BALL_COLOUR = 'white';
const BORDER_COLOUR = 'gray';

export function updateBackground(backgroundPath: string): void {
  const backgroundImg = document.getElementById('game-background') as HTMLImageElement;
  if (!backgroundImg) {
    console.warn("Couldn't find backgroundImg element");
    return;
  }
  backgroundImg.src = backgroundPath;
}

// TODO: Change to get true Canvas Height and Width
export const CANVAS_HEIGHT = 720;
export const CANVAS_WIDTH = 1200;

const myGameArea: GameArea = {
  canvas: null,
  context: null,

  start() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    if (!this.canvas) {
      console.error('No game-canvas present');
      return;
    }

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext('2d');
    if (!this.context) {
      console.error('No canvas context available');
      return;
    }
  },

  clear() {
    if (this.context && this.canvas) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  stop() {},
};

export function renderGame(webSocket: WebSocket) {
  myGameArea.start();
  let filledAnimationIsOn: boolean = false;

  webSocket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    if (messageData.type === 'game_state') {
      myGameArea.clear();
      drawBoard(myGameArea.context as CanvasRenderingContext2D, messageData.state as GameState);
      drawPowerBar(messageData.state as GameState, filledAnimationIsOn);
      triggerAnimation(myGameArea.context as CanvasRenderingContext2D, messageData.state);
      triggerSound(myGameArea.context as CanvasRenderingContext2D, messageData.state);
    }
  };
}

function drawBoard(ctx: CanvasRenderingContext2D, state: GameState) {
  drawPaddle(ctx, state.leftPaddle);
  drawPaddle(ctx, state.rightPaddle);
  drawBall(ctx, state.ball);
  state.fakeBalls.forEach((fakeBall) => drawBall(ctx, fakeBall));
}

function drawPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle) {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  if (ball.isVisible) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = BALL_COLOUR;
    ctx.fill();
    ctx.strokeStyle = BORDER_COLOUR;
    ctx.stroke();
    ctx.closePath();
  }
}

function drawPowerBar(state: GameState, filledAnimationIsOn: boolean) {
  function updatePowerBar(side: string, value: number, filledAnimationIsOn: boolean) {
    const powerBar = document.getElementById(`${side}-character-power-bar-fill`);
    if (!powerBar) {
      console.warn(`${side}-character player bar not found`);
      return;
    }

    powerBar.style.width = `${value}`;

    if (value === 100) {
      activatePowerBarAnimation(side);
      filledAnimationIsOn = true;
    } else {
      deactivatePowerBarAnimation(side);
      filledAnimationIsOn = false;
    }
  }

  updatePowerBar('left', state.leftPowerBarFill, filledAnimationIsOn);
  updatePowerBar('right', state.rightPowerBarFill, filledAnimationIsOn);
}

function triggerAnimation(ctx: CanvasRenderingContext2D, state: GameState) {
  if (state.leftAnimation) powerUpAnimation('left');
  if (state.rightAnimation) powerUpAnimation('right');
}

function triggerSound(ctx: CanvasRenderingContext2D, state: GameState) {}
