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
    accentColour: 'red',
    selectHelpMessage: "Eat one to increase your paddle's size!",
  },
  {
    name: 'Yoshi',
    attack: 'Egg Barrage',
    characterSelectPicturePath: `${characterSelectPicturePath}yoshi.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}yoshi.png`,
    accentColour: 'green',
    selectHelpMessage: 'Fill the field with fake targets!',
  },
  {
    name: 'Sonic',
    attack: 'Spin Dash',
    characterSelectPicturePath: `${characterSelectPicturePath}sonic.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}sonic.png`,
    accentColour: 'blue',
    selectHelpMessage: "Increase the ball's speed!",
  },
  {
    name: 'Pikachu',
    attack: 'Thunder Wave',
    characterSelectPicturePath: `${characterSelectPicturePath}pikachu.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}pikachu.png`,
    accentColour: 'yellow',
    selectHelpMessage: "Paralyze your opponent's paddle",
  },
  {
    name: 'Mewtwo',
    attack: 'Confusion',
    characterSelectPicturePath: `${characterSelectPicturePath}mewtwo.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}mewtwo.png`,
    accentColour: 'purple',
    selectHelpMessage: "Mess with your opponent's controls!",
  },
  {
    name: 'Link',
    attack: 'Magic Mirror',
    characterSelectPicturePath: `${characterSelectPicturePath}link.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}link.png`,
    accentColour: 'cyan',
    selectHelpMessage: "Reflect the ball's trajectory!",
  },
  {
    name: 'Kirby',
    attack: 'The Amazing Mirror',
    characterSelectPicturePath: `${characterSelectPicturePath}kirby.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}kirby.png`,
    accentColour: 'pink',
    selectHelpMessage: "Use your enemy's powers!",
  },
  {
    name: 'Donkey Kong',
    attack: 'Giant Punch',
    characterSelectPicturePath: `${characterSelectPicturePath}donkey_kong.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}donkey_kong.png`,
    accentColour: 'orange',
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
