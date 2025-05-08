/**
 * @file player.ts
 * @brief Defines the Player class and its associated functionality.
 */

import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Attack } from './attack.js';

/**
 * @class Player
 * @brief Represents a player in the game, including their paddle, score, and attack capabilities.
 */
export class Player {
  ownPaddle: Paddle; /**< The player's own paddle. */
  enemyPaddle: Paddle; /**< The opponent's paddle. */
  ball: Ball; /**< The ball in the game. */
  alias?: string; /**< Optional alias for the player. */
  score: number; /**< The player's current score. */
  attack: Attack | null; /**< The player's attack object, or null if no attack is assigned. */
  side: string; /**< The side of the game field the player is on. */

  /**
   * @brief Constructs a new Player object.
   * @param ownPaddle The player's own paddle.
   * @param enemyPaddle The opponent's paddle.
   * @param ball The ball in the game.
   * @param alias An optional alias for the player.
   * @param attackName The name of the attack, or null if no attack is assigned.
   * @param side The side of the game field the player is on.
   */
  constructor(
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string,
    attackName: string | null,
    side: string,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attack = attackName ? new Attack(attackName, ownPaddle, enemyPaddle, ball, side) : null;
    this.side = side;
  }

  /**
   * @brief Increases the player's score by one.
   */
  increaseScore(): void {
    ++this.score;
  }

  /**
   * @brief Retrieves the player's current score.
   * @return The player's score.
   */
  getScore(): number {
    return this.score;
  }
}
