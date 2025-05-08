/**
 * @file gameArea.ts
 * @brief This file defines the GameArea interface and imports necessary modules for game state management and input handling.
 */

import { gameState, InputHandler } from './game';

/**
 * @interface GameArea
 * @brief Represents the game area, including the canvas, context, and game state.
 */
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
