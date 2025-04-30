import type { GameArea, GameState } from './remoteGameTypes.js';

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

  webSocket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    if (messageData.type === 'game-state') {
      drawBoard(myGameArea.context as CanvasRenderingContext2D, messageData.state);
      triggerAnimation(myGameArea.context as CanvasRenderingContext2D, messageData.state);
      triggerSound(myGameArea.context as CanvasRenderingContext2D, messageData.state);
    }
  };
}

function drawBoard(ctx: CanvasRenderingContext2D, state: GameState) {
  state.leftPaddle.draw(ctx);
  state.rightPaddle.draw(ctx);
  state.ball.draw(ctx);
}

function triggerAnimation(ctx: CanvasRenderingContext2D, state: GameState) {
  if 
}

function triggerSound(ctx: CanvasRenderingContext2D, state: GameState) {}
