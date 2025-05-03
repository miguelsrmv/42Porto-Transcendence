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
  /**
   * @brief The HTML canvas element used for rendering the game.
   */
  canvas: HTMLCanvasElement | null;

  /**
   * @brief The 2D rendering context for the canvas.
   */
  context?: CanvasRenderingContext2D | null;

  /**
   * @brief The interval ID for the game loop.
   */
  interval?: number;

  /**
   * @brief The input handler for managing user inputs.
   */
  inputHandler: InputHandler | null;

  /**
   * @brief The current state of the game.
   */
  state: gameState;

  /**
   * @brief Starts the game area, initializing necessary components.
   */
  start(): void;

  /**
   * @brief Clears the game area, resetting the canvas.
   */
  clear(): void;

  /**
   * @brief Stops the game area, halting the game loop.
   */
  stop(): void;
}
