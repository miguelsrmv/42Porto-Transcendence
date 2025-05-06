/**
 * @file gameStatsTypes.ts
 * @brief This file contains the implementation of the gameStats and playerStats classes.
 */

import { SPEED } from '../localGameApp/game.js';

/**
 * @interface GameArea
 * @brief Represents the game area, including the canvas and its context.
 */
export interface GameArea {
  canvas: HTMLCanvasElement | null;
  context?: CanvasRenderingContext2D | null;
  start(): void;
  clear(): void;
  stop(): void;
}

/**
 * @interface Ball
 * @brief Represents a ball in the game.
 */
export interface Ball {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  radius: number;
  speedX: number;
  speedY: number;
  isVisible: boolean;
}

/**
 * @interface Paddle
 * @brief Represents a paddle in the game.
 */
export interface Paddle {
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
  speedY: number;
  speedModifier: number;
}

/**
 * @interface GameState
 * @brief Represents the state of the game.
 */
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

/**
 * @class gameStats
 * @brief Represents the statistics of a game, including stats for both players and the maximum speed.
 */
export class gameStats {
  left: playerStats; /**< Statistics for the left player. */
  right: playerStats; /**< Statistics for the right player. */
  maxSpeed: number; /**< The maximum speed calculated or updated for the game. */

  /**
   * @brief Constructs a new gameStats object and initializes player stats and max speed.
   */
  constructor() {
    this.left = new playerStats();
    this.right = new playerStats();
    this.maxSpeed = Math.sqrt(SPEED ** 2 + SPEED ** 2); // Done
  }

  /**
   * @brief Updates the maximum speed of the game.
   * @param newSpeed The new maximum speed to set.
   */
  updateMaxSpeed(newSpeed: number) {
    this.maxSpeed = newSpeed;
  }
}

/**
 * @class playerStats
 * @brief Represents the statistics of an individual player.
 */
export class playerStats {
  goals: number; /**< The number of goals scored by the player. */
  sufferedGoals: number; /**< The number of goals suffered by the player. */
  saves: number; /**< The number of saves made by the player. */
  powersUsed: number; /**< The number of powers used by the player. */

  constructor() {
    this.goals = 0;
    this.sufferedGoals = 0;
    this.saves = 0;
    this.powersUsed = 0;
  }

  increaseGoals() {
    ++this.goals;
  }

  increaseSufferedGoals() {
    ++this.sufferedGoals;
  }

  increaseSaves() {
    ++this.saves;
  }

  increasePowersUsed() {
    ++this.powersUsed;
  }
}
