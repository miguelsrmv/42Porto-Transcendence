/**
 * @file gameStats.ts
 * @brief This file contains the implementation of the gameStats and playerStats classes.
 */

import { SPEED } from './game.js';

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
class playerStats {
  goals: number; /**< The number of goals scored by the player. */
  sufferedGoals: number; /**< The number of goals suffered by the player. */
  saves: number; /**< The number of saves made by the player. */
  powersUsed: number; /**< The number of powers used by the player. */

  /**
   * @brief Constructs a new playerStats object and initializes all stats to zero.
   */
  constructor() {
    this.goals = 0;
    this.sufferedGoals = 0;
    this.saves = 0;
    this.powersUsed = 0;
  }

  /**
   * @brief Increases the number of goals scored by the player by one.
   */
  increaseGoals() {
    ++this.goals;
  }

  /**
   * @brief Increases the number of goals suffered by the player by one.
   */
  increaseSufferedGoals() {
    ++this.sufferedGoals;
  }

  /**
   * @brief Increases the number of saves made by the player by one.
   */
  increaseSaves() {
    ++this.saves;
  }

  /**
   * @brief Increases the number of powers used by the player by one.
   */
  increasePowersUsed() {
    ++this.powersUsed;
  }
}
