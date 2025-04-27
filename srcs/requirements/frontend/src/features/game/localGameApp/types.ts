import { gameState, InputHandler } from './game';

export interface GameArea {
  canvas: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  interval?: number;
  inputHandler: InputHandler | null;
  state: gameState;
  start(): void;
  clear(): void;
  stop(): void;
}
