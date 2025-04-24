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
  playType: playType;
  gameType: gameType;
  alias1: string;
  alias2: string;
  paddleColour1: string;
  paddleColour2: string;
  character1: character | null;
  character2: character | null;
  background: background;
}

/**
 * @brief Initial interface for remote game settings.
 *
 * This interface defines the structure for game settings, including play type, game type,
 * optional player aliases, paddle colors and optional character; it's used to send to the backend
 */
export interface leanGameSettings {
  playerID: string;
  playType: playType;
  gameType: gameType;
  alias: string;
  paddleColour: string;
  character: character | null;
}
