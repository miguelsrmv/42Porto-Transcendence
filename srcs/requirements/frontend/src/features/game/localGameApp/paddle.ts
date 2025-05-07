/**
 * @file paddle.ts
 * @brief This file contains the Paddle class, which represents a paddle in the game.
 */

import { CANVAS_HEIGHT, PADDLE_LEN, PADDLE_START_Y_POS } from './game.js';

/**
 * @class Paddle
 * @brief Represents a paddle in the game.
 */
export class Paddle {
  width: number; /**< The width of the paddle. */
  height: number; /**< The height of the paddle. */
  color: string; /**< The color of the paddle. */
  x: number; /**< The x-coordinate of the paddle. */
  y: number; /**< The y-coordinate of the paddle. */
  speedY: number; /**< The vertical speed of the paddle. */
  speedModifier: number; /**< The speed modifier for the paddle. */

  /**
   * @brief Constructs a new Paddle object.
   * @param width The width of the paddle.
   * @param height The height of the paddle.
   * @param color The color of the paddle.
   * @param x The x-coordinate of the paddle.
   * @param y The y-coordinate of the paddle.
   */
  constructor(width: number, height: number, color: string, x: number, y: number) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedY = 0;
    this.speedModifier = 1;
  }

  /**
   * @brief Draws the paddle on the canvas.
   * @param ctx The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * @brief Updates the paddle's position.
   * @param dt The time delta for the update.
   */
  update(dt: number): void {
    this.y += this.speedY * dt;
    // Clamp position within canvas bounds
    this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
  }

  /**
   * @brief Sets the height of the paddle.
   * @param height The new height of the paddle.
   */
  setHeight(height: number): void {
    this.height = height;
  }

  /**
   * @brief Sets the y-coordinate of the paddle.
   * @param y The new y-coordinate of the paddle.
   */
  setY(y: number): void {
    this.y = y;
  }

  /**
   * @brief Sets the vertical speed of the paddle.
   * @param speedY The new vertical speed of the paddle.
   */
  setSpeedY(speedY: number): void {
    this.speedY = speedY;
  }

  /**
   * @brief Sets the speed modifier for the paddle.
   * @param modifier The new speed modifier.
   */
  setSpeedModifier(modifier: number): void {
    this.speedModifier = modifier;
  }

  /**
   * @brief Resets the paddle to its initial state.
   */
  reset(): void {
    this.y = PADDLE_START_Y_POS;
    this.speedY = 0;
    this.speedModifier = 1;
    this.height = PADDLE_LEN;
  }
}
