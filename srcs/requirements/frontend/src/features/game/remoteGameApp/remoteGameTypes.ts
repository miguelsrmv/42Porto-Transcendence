/**
 * @file gameInterfaces.ts
 * @brief This file contains TypeScript interfaces for a game, including the game area, ball, paddle, and game state.
 */

/**
 * @interface GameArea
 * @brief Represents the game area, including the canvas and its context.
 */
export interface GameArea {
  /**
   * @brief The HTML canvas element used for the game.
   */
  canvas: HTMLCanvasElement | null;

  /**
   * @brief The 2D rendering context for the canvas.
   */
  context?: CanvasRenderingContext2D | null;

  /**
   * @brief Starts the game area.
   */
  start(): void;

  /**
   * @brief Clears the game area.
   */
  clear(): void;

  /**
   * @brief Stops the game area.
   */
  stop(): void;
}

/**
 * @interface Ball
 * @brief Represents a ball in the game.
 */
export interface Ball {
  /**
   * @brief The current x-coordinate of the ball.
   */
  x: number;

  /**
   * @brief The current y-coordinate of the ball.
   */
  y: number;

  /**
   * @brief The previous x-coordinate of the ball.
   */
  previousX: number;

  /**
   * @brief The previous y-coordinate of the ball.
   */
  previousY: number;

  /**
   * @brief The radius of the ball.
   */
  radius: number;

  /**
   * @brief The horizontal speed of the ball.
   */
  speedX: number;

  /**
   * @brief The vertical speed of the ball.
   */
  speedY: number;

  /**
   * @brief Indicates whether the ball is visible.
   */
  isVisible: boolean;
}

/**
 * @interface Paddle
 * @brief Represents a paddle in the game.
 */
export interface Paddle {
  /**
   * @brief The width of the paddle.
   */
  width: number;

  /**
   * @brief The height of the paddle.
   */
  height: number;

  /**
   * @brief The color of the paddle.
   */
  color: string;

  /**
   * @brief The x-coordinate of the paddle.
   */
  x: number;

  /**
   * @brief The y-coordinate of the paddle.
   */
  y: number;

  /**
   * @brief The vertical speed of the paddle.
   */
  speedY: number;

  /**
   * @brief The speed modifier for the paddle.
   */
  speedModifier: number;
}

/**
 * @interface GameState
 * @brief Represents the state of the game.
 */
export interface GameState {
  /**
   * @brief The main ball in the game.
   */
  ball: Ball;

  /**
   * @brief An array of fake balls in the game.
   */
  fakeBalls: Ball[];

  /**
   * @brief The left paddle in the game.
   */
  leftPaddle: Paddle;

  /**
   * @brief The right paddle in the game.
   */
  rightPaddle: Paddle;

  /**
   * @brief The fill level of the left power bar.
   */
  leftPowerBarFill: number;

  /**
   * @brief The fill level of the right power bar.
   */
  rightPowerBarFill: number;

  /**
   * @brief Indicates whether the left paddle animation is active.
   */
  leftAnimation: boolean;

  /**
   * @brief Indicates whether the right paddle animation is active.
   */
  rightAnimation: boolean;
}
