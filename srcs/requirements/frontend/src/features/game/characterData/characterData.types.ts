/** @brief Defines types and interfaces for character data in the game.
 *
 * This file contains type definitions for character attacks and the character data interface,
 * which includes properties for character names, attacks, image paths, and help messages.
 */

/**
 * @brief Identifiers for character attacks.
 *
 * This type defines the possible attack names associated with each character in the game.
 */
export type attackIdentifier =
  | 'Super Shroom'
  | 'Egg Barrage'
  | 'Spin Dash'
  | 'Thunder Wave'
  | 'Confusion'
  | 'Magic Mirror'
  | 'Mini'
  | 'Giant Punch';

/**
 * @brief Interface for character data.
 *
 * This interface defines the structure for character data objects, including the character's name,
 * attack type, paths to selection and avatar images, and a help message for character selection.
 */
export interface character {
  name: string;
  attack: attackIdentifier;
  characterSelectPicturePath: string;
  characterAvatarPicturePath: string;
  accentColour: string;
  selectHelpMessage: string;
}
