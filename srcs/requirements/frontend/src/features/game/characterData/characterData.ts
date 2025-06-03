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
    name: 'Donkey Kong',
    attack: 'Giant Punch',
    characterSelectPicturePath: `${characterSelectPicturePath}donkey_kong.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}donkey_kong.png`,
    accentColour: 'orange',
    selectHelpMessage: "Smash your opponent's paddle!",
  },
  {
    name: 'Bowser',
    attack: 'Shell Decoy',
    characterSelectPicturePath: `${characterSelectPicturePath}bowser.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}bowser.png`,
    accentColour: 'lime',
    selectHelpMessage: 'Hide the ball in your shell!',
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
    attack: 'Gale Boomerang',
    characterSelectPicturePath: `${characterSelectPicturePath}link.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}link.png`,
    accentColour: 'cyan',
    selectHelpMessage: "Invert the ball's trajectory!",
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
    name: 'Samus',
    attack: 'Morph Ball',
    characterSelectPicturePath: `${characterSelectPicturePath}samus.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}samus.png`,
    accentColour: 'amber',
    selectHelpMessage: "Slow down the ball with Samus' morph!",
  },
  {
    name: 'Captain Falcon',
    attack: 'Falcon Dive',
    characterSelectPicturePath: `${characterSelectPicturePath}captain_falcon.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}captain_falcon.png`,
    accentColour: 'indigo',
    selectHelpMessage: 'Speed up your paddle!',
  },
  {
    name: 'Snake',
    attack: 'Sabotage',
    characterSelectPicturePath: `${characterSelectPicturePath}snake.png`,
    characterAvatarPicturePath: `${characterAvatarPicturePath}snake.png`,
    accentColour: 'zinc',
    selectHelpMessage: "Hide your opponent's paddle!",
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

export function getCharacterPathFromBackend(name: string): string {
  let index: number = 0;

  switch (name) {
    case 'MARIO':
      index = 0;
      break;
    case 'YOSHI':
      index = 1;
      break;
    case 'DK':
      index = 2;
      break;
    case 'BOWSER':
      index = 3;
      break;
    case 'SONIC':
      index = 4;
      break;
    case 'PIKACHU':
      index = 5;
      break;
    case 'MEWTWO':
      index = 6;
      break;
    case 'LINK':
      index = 7;
      break;
    case 'KIRBY':
      index = 8;
      break;
    case 'SAMUS':
      index = 9;
      break;
    case 'CAPFALCON':
      index = 10;
      break;
    case 'SNAKE':
      index = 11;
      break;
  }

  return characterList[index].characterAvatarPicturePath;
}

export function getAccentColourFromBackend(name: string): string {
  let index: number = 0;

  switch (name) {
    case 'MARIO':
      index = 0;
      break;
    case 'YOSHI':
      index = 1;
      break;
    case 'DK':
      index = 2;
      break;
    case 'BOWSER':
      index = 3;
      break;
    case 'SONIC':
      index = 4;
      break;
    case 'PIKACHU':
      index = 5;
      break;
    case 'MEWTWO':
      index = 6;
      break;
    case 'LINK':
      index = 7;
      break;
    case 'KIRBY':
      index = 8;
      break;
    case 'SAMUS':
      index = 9;
      break;
    case 'CAPFALCON':
      index = 10;
      break;
    case 'SNAKE':
      index = 11;
      break;
  }

  return characterList[index].accentColour;
}
