import { Ball } from '../localGameApp/ball.js';
import { Paddle } from '../localGameApp/paddle.js';

export interface GameArea {
  canvas: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  start(): void;
  clear(): void;
  stop(): void;
}

export interface GameState {
  ball: Ball;
  fakeBalls: Ball[];
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPowerBarFill: number;
  rightPowerBarFill: number;
  leftAnimation: boolean;
  rightAnimation: boolean;
}
