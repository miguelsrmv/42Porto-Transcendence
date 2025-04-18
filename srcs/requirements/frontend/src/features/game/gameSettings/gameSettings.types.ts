import { background } from '../backgroundData/backgroundData.types.js';
import { character } from '../characterData/characterData.types.js';

/**
 * @file gameSettings.types.ts
 * @brief Defines types and interfaces for game settings.
 *
 * This file contains type definitions and interfaces used to configure game settings,
 * including play type, game type, player aliases, paddle colors, characters, and background.
 */

/**
 * @brief Type representing the play mode.
 *
 * This type defines the different modes of play available in the game.
 */
export type playType = 'Local Play' | 'Remote Play' | 'Tournament Play';

/**
 * @brief Type representing the game variant.
 *
 * This type defines the different game variants available.
 */
export type gameType = 'Classic Pong' | 'Crazy Pong';

/**
 * @brief Interface for game settings.
 *
 * This interface defines the structure for game settings, including play type, game type,
 * optional player aliases, paddle colors, optional characters, and background.
 */
export interface gameSettings {
  /**
   * @brief The mode of play.
   */
  playType: playType;

  /**
   * @brief The variant of the game.
   */
  gameType: gameType;

  /**
   * @brief Optional alias for player 1.
   */
  alias1?: string;

  /**
   * @brief Optional alias for player 2.
   */
  alias2?: string;

  /**
   * @brief Color of player 1's paddle.
   */
  paddleColour1: string;

  /**
   * @brief Optional color of player 2's paddle.
   */
  paddleColour2?: string;

  /**
   * @brief Optional character for player 1.
   */
  character1?: character;

  /**
   * @brief Optional character for player 2.
   */
  character2?: character;

  /**
   * @brief The background setting for the game.
   */
  background: background;
}
