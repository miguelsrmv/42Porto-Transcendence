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

/**
 * @brief Path to the character avatar images.
 */
const characterAvatarPicturePath = '../../../../static/character_portrait/';

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
    selectHelpMessage: "Eat one to increase your paddle's size!",
  },
  {
    name: 'Yoshi',
    attack: 'Egg Barrage',
    characterSelectPicturePath: `${characterSelectPicturePath}yoshi.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}yoshi.png`,
    selectHelpMessage: 'Fill the field with fake targets!',
  },
  {
    name: 'Sonic',
    attack: 'Spin Dash',
    characterSelectPicturePath: `${characterSelectPicturePath}sonic.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}sonic.png`,
    selectHelpMessage: "Increase the ball's speed!",
  },
  {
    name: 'Pikachu',
    attack: 'Thunder Wave',
    characterSelectPicturePath: `${characterSelectPicturePath}pikachu.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}pikachu.png`,
    selectHelpMessage: "Paralyze your opponent's paddle",
  },
  {
    name: 'Mewtwo',
    attack: 'Confusion',
    characterSelectPicturePath: `${characterSelectPicturePath}mewtwo.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}mewtwo.png`,
    selectHelpMessage: "Mess with your opponent's paddle!",
  },
  {
    name: 'Link',
    attack: 'Hurricane Blade',
    characterSelectPicturePath: `${characterSelectPicturePath}link.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}link.png`,
    selectHelpMessage: 'Redirect the ball with a sword slash!',
  },
  {
    name: 'Samus',
    attack: 'Missiles',
    characterSelectPicturePath: `${characterSelectPicturePath}samus.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}samus.png`,
    selectHelpMessage: "Aim and destroy your opponent's paddle!",
  },
  {
    name: 'Donkey Kong',
    attack: 'Giant Punch',
    characterSelectPicturePath: `${characterSelectPicturePath}donkey_kong.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}donkey_kong.png`,
    selectHelpMessage: "Smash your opponent's paddle!",
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
