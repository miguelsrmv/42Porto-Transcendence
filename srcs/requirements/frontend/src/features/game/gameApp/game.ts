import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { setupInput, handleInput } from './input.js';
import { checkWallCollision, checkPaddleCollision, checkGoal } from './collisions.js';
import type { GameArea } from './types.js';
import type { gameSettings, playType, gameType } from '../gameSettings/gameSettings.types.js';
import type { background } from '../backgroundData/backgroundData.types.js';
import { Player } from './player.js';

export const SPEED = 5;
export const CANVAS_HEIGHT = 720;
export const CANVAS_WIDTH = 1200;
export const PADDLE_LEN = CANVAS_HEIGHT * 0.2;
const PADDLE_WID = 12;
export const PADDLE_START_Y_POS = CANVAS_HEIGHT / 2 - PADDLE_LEN / 2;
export const BALL_RADIUS = 10;

let rightPaddle: Paddle;
let leftPaddle: Paddle;
let ball: Ball;
let leftPlayer: Player;
let rightPlayer: Player;

export type InputHandler = {
  enable(): void;
  disable(): void;
};

export enum gameState {
  playing,
  paused,
  ended,
}

// TODO: Call stop() when leaving the page, etc.
const myGameArea: GameArea = {
  canvas: null,
  context: null,
  interval: undefined,
  inputHandler: null,
  state: gameState.paused,

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
    this.state = gameState.playing;
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
    this.inputHandler?.disable();
    this.state = gameState.ended;
  },
};

function setPaddles(gameSettings: gameSettings) {
  if (!gameSettings.paddleColour1 || !gameSettings.paddleColour2) {
    console.error('Paddle color missing.');
    return;
  }
  leftPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    gameSettings.paddleColour1,
    PADDLE_WID,
    PADDLE_START_Y_POS,
  );
  rightPaddle = new Paddle(
    PADDLE_WID,
    PADDLE_LEN,
    gameSettings.paddleColour2,
    CANVAS_WIDTH - 20,
    PADDLE_START_Y_POS,
  );
}

function setPlayers(
  leftPaddle: Paddle,
  rightPaddle: Paddle,
  ball: Ball,
  gameSettings: gameSettings,
): void {
  leftPlayer = new Player(
    leftPaddle,
    rightPaddle,
    ball,
    gameSettings.alias1,
    gameSettings.character1?.attack,
    'left',
  );
  rightPlayer = new Player(
    rightPaddle,
    leftPaddle,
    ball,
    gameSettings.alias2,
    gameSettings.character2?.attack,
    'right',
  );

  function setPowerUpBar(player: Player): void {
    const PlayerBar = document.getElementById(`${player.side}-character-power-bar-fill`);

    if (!PlayerBar) {
      console.warn(`${player.side} player bar not found`);
      return;
    }

    window.setInterval(() => {
      if (player.attack && myGameArea.state === gameState.playing) {
        const lastUsed: number = player.attack.lastUsed;
        const coolDown: number = player.attack.attackCooldown;
        const currentTime: number = Date.now();

        const percentage = Math.min(((currentTime - lastUsed) * 100) / coolDown, 100);
        PlayerBar.style.width = `${percentage}%`;

        if (percentage == 100) player.attack.attackIsAvailable = true;
      }
    }, 20);
  }

  setPowerUpBar(leftPlayer);
  setPowerUpBar(rightPlayer);
}

export function initializeGame(gameSettings: gameSettings): void {
  const pongPage = document.getElementById('game-container') as HTMLElement | null;
  if (!pongPage) {
    console.error('Cannot start the game: game-container is missing.');
    return;
  }

  updateBackground(gameSettings.background);
  setPaddles(gameSettings);
  ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, BALL_RADIUS, SPEED);
  setPlayers(leftPaddle, rightPaddle, ball, gameSettings);
  myGameArea.inputHandler = setupInput(leftPlayer, rightPlayer);
  // TODO: Look into event listeners for back/foward/reload
  //window.addEventListener('beforeunload', () => myGameArea.stop());
  //window.addEventListener('popstate', () => myGameArea.stop());
  myGameArea.start();
}

async function updateGameArea() {
  myGameArea.clear();

  handleInput(leftPlayer, rightPlayer, myGameArea.state);

  leftPaddle.update();
  rightPaddle.update();
  ball.move();

  if (!myGameArea.canvas) {
    console.error('Error getting canvas element!');
    return;
  }
  checkWallCollision(ball, myGameArea);
  checkPaddleCollision(ball, leftPaddle, rightPaddle);
  await checkGoal(leftPlayer, rightPlayer, myGameArea);

  if (myGameArea.context) {
    leftPaddle.draw(myGameArea.context);
    rightPaddle.draw(myGameArea.context);
    ball.draw(myGameArea.context);
  }
}

function updateBackground(background: background | null) {
  if (!background) return;
  const backgroundImg = document.getElementById('game-background') as HTMLImageElement;
  backgroundImg.src = background.imagePath;
}

export function getGameVersion(): number {
  return leftPlayer.getScore() + rightPlayer.getScore();
}

export function paintScore(side: string, score: number): void {
  const emptyScorePoint = document.getElementById(`${side}-score-card-${score}`);
  if (!emptyScorePoint) {
    console.warn(`No element found: ${side}-score-card-${score}`);
    return;
  }

  const colour = emptyScorePoint.className.match(/border-([a-z]+)-500/)?.[1];

  emptyScorePoint.classList.remove('border-2', `border-${colour}-500`);
  emptyScorePoint.classList.add(`bg-${colour}-500`);
}

/* // Unused but might be useful in the future
function paintBackground(context : CanvasRenderingContext2D): void {

  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

  const backgroundImg = new Image();
  backgroundImg.src = "../../../../static/backgrounds/Backyard.png"; // Replace with your image path

  backgroundImg.onload = () => {
    context?.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height); // Draw image to fill canvas
  };
}
*/
