/**
 * @file characterData.ts
 * @brief Provides character data and related functions for the game.
 *
 * This module defines the character data used in the game, including their names, attacks,
 * and image paths. It also provides functions to retrieve character data.
 */

import { character } from './characterData.types.js';

/**
 * @brief Path to the character selection images.
 */
const characterSelectPicturePath = '../../../../static/character_select/';

// TODO: Change characterAvatarPicture Path (I need to get proper avatars first)
/**
 * @brief Path to the character avatar images.
 */
const characterAvatarPicturePath = characterSelectPicturePath;

/**
 * @brief Array of character data objects.
 *
 * Each object contains the character's name, attack, image paths, and a help message.
 */
const characterList: character[] = [
  {
    name: 'Mario',
    attack: 'Super Shroom',
    characterSelectPicturePath: `${characterSelectPicturePath}mario.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}mario.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Yoshi',
    attack: 'Egg Barrage',
    characterSelectPicturePath: `${characterSelectPicturePath}yoshi.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}yoshi.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Sonic',
    attack: 'Spin Dash',
    characterSelectPicturePath: `${characterSelectPicturePath}sonic.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}sonic.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Pikachu',
    attack: 'Thunder Wave',
    characterSelectPicturePath: `${characterSelectPicturePath}pikachu.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}pikachu.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Mewtwo',
    attack: 'Confusion',
    characterSelectPicturePath: `${characterSelectPicturePath}mewtwo.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}mewtwo.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Link',
    attack: 'Hurricane Blade',
    characterSelectPicturePath: `${characterSelectPicturePath}link.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}link.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Samus',
    attack: 'Missiles',
    characterSelectPicturePath: `${characterSelectPicturePath}samus.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}samus.png`,
    selectHelpMessage: '',
  },
  {
    name: 'Donkey Kong',
    attack: 'Giant Punch',
    characterSelectPicturePath: `${characterSelectPicturePath}donkey_kong.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}donkey_kong.png`,
    selectHelpMessage: '',
  },
] as const;

/**
 * @brief Retrieves all character data.
 *
 * @return The list of all character data.
 */
export function getCharacterList(): character[] {
  return characterList;
}
