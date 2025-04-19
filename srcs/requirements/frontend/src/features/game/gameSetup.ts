/**
 * @file gameSetup.ts
 * @brief Handles the setup of game types, character selection, and background selection for the game.
 *
 * This module provides functions to configure game settings, including selecting game types,
 * characters, and backgrounds. It also manages user interactions for these selections.
 */

import type { gameType, playType, gameSettings } from './gameSettings/gameSettings.types.js';
import { getCharacterList } from './characterData/characterData.js';
import { getBackgroundList } from './backgroundData/backgroundData.js';
export type gameSettingKey =
  | 'playType'
  | 'gameType'
  | 'player1Alias'
  | 'player1PaddleColour'
  | 'player1Character'
  | 'player2Alias'
  | 'player2PaddleColour'
  | 'player2Character'
  | 'background'
  | 'gameType';

/**
 * @brief Partial settings object to store game configurations.
 */
const settings: Partial<gameSettings> = {};

/**
 * @brief Index for the current character selection for player 1.
 */
let currentCharacterIndex1: number = 0;

/**
 * @brief Index for the current character selection for player 2.
 */
let currentCharacterIndex2: number = 0;

/**
 * @brief Index for the current background selection.
 */
let backgroundIndex: number = 0;

/**
 * @brief List of available characters for selection.
 */
const characterList = getCharacterList();

/**
 * @brief List of available backgrounds for selection.
 */
const backgroundList = getBackgroundList();

/**
 * @brief Prompts the user to select a game type.
 *
 * This function waits for the user to click on either the "classic" or "crazy" game type button
 * and resolves the promise with the selected game type.
 *
 * @return A promise that resolves to a string indicating the selected game type ("classic" or "crazy").
 */
export async function getGameType(): Promise<gameType> {
  return new Promise((resolve) => {
    const classicButton = document.getElementById('classic-pong-button');
    const crazyButton = document.getElementById('crazy-pong-button');

    if (classicButton && crazyButton) {
      classicButton.addEventListener(
        'click',
        () => {
          resolve('Classic Pong');
        },
        { once: true },
      );
      crazyButton.addEventListener(
        'click',
        () => {
          resolve('Crazy Pong');
        },
        { once: true },
      );
    }
  });
}

/**
 * @brief Creates a character selection loop for a player.
 *
 * This function allows a player to cycle through available characters using previous and next buttons.
 * It updates the character display based on user interaction.
 *
 * @param player_number The player number for which the character loop is created. Defaults to 1.
 */
export function createCharacterLoop(player_number: number = 1) {
  const prevButton: HTMLButtonElement | null = document.getElementById(
    `prev-character-${player_number}`,
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement | null = document.getElementById(
    `next-character-${player_number}`,
  ) as HTMLButtonElement;
  const characterDisplay: HTMLImageElement | null = document.getElementById(
    `character-img-${player_number}`,
  ) as HTMLImageElement;

  let currentCharacterIndex = 0;

  // Updates character display picture, index and help text
  function updateCharacter(): void {
    updateCharacterIndex();
    updateCharacterDisplay();
    updateCharacterHelpText();
  }

  // Updates the characterIndex of player 1 or 2, depending on player_number
  function updateCharacterIndex(): void {
    if (player_number === 1) {
      currentCharacterIndex1 = currentCharacterIndex;
      settings.character1 = characterList[currentCharacterIndex];
    } else if (player_number === 2) {
      currentCharacterIndex2 = currentCharacterIndex;
      settings.character2 = characterList[currentCharacterIndex];
    }
  }

  // Updates the character's display
  function updateCharacterDisplay(): void {
    if (characterDisplay) {
      characterDisplay.src = characterList[currentCharacterIndex].characterSelectPicturePath;
    }
  }

  // Updates the character's helper text
  function updateCharacterHelpText(): void {
    return; //TODO:Do this function!
  }

  // Event listener for previous button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Decrement the index and cycle back to the end if necessary
      currentCharacterIndex =
        currentCharacterIndex === 0 ? characterList.length - 1 : currentCharacterIndex - 1;
      updateCharacter();
    });
  }

  // Event listener for next button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Increment the index and cycle back to the start if necessary
      currentCharacterIndex =
        currentCharacterIndex === characterList.length - 1 ? 0 : currentCharacterIndex + 1;
      updateCharacter();
    });
  }

  // Initialize the first character
  updateCharacter();
}

/**
 * @brief Creates a background selection loop.
 *
 * This function allows the user to cycle through available backgrounds using previous and next buttons.
 * It updates the background display based on user interaction.
 */
export function createBackgroundLoop() {
  const prevButton: HTMLButtonElement | null = document.getElementById(
    'prev-background',
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement | null = document.getElementById(
    'next-background',
  ) as HTMLButtonElement;
  const backgroundDisplay: HTMLImageElement | null = document.getElementById(
    'background-img',
  ) as HTMLImageElement;

  function updateBackgroundDisplay(): void {
    if (backgroundDisplay) backgroundDisplay.src = backgroundList[backgroundIndex].imagePath;
  }

  // Event listener for previous button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Decrement the index and cycle back to the end if necessary
      backgroundIndex = backgroundIndex === 0 ? backgroundList.length - 1 : backgroundIndex - 1;
      updateBackgroundDisplay();
    });
  }

  // Event listener for next button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Increment the index and cycle back to the start if necessary
      backgroundIndex = backgroundIndex === backgroundList.length - 1 ? 0 : backgroundIndex + 1;
      updateBackgroundDisplay();
    });
  }

  // Initialize the first character
  updateBackgroundDisplay();
}

/**
 * @brief Sets the game settings based on user input.
 *
 * This function retrieves user input for game type, play type, player aliases, paddle colors, and character selections.
 * It updates the global game settings object with these values.
 *
 * @param gameType The type of game selected by the user.
 * @param playType The play type selected by the user.
 */
export function setGameSettings(gameType: gameType, playType: playType) {
  settings.gameType = gameType;
  settings.playType = playType;

  const player1InputAlias = document.getElementById('player-1-alias') as HTMLInputElement;
  if (player1InputAlias) {
    console.log(player1InputAlias.value);
    settings.alias1 = player1InputAlias.value;
  } else console.warn('Player 1 alias input form not found');

  const player1PaddleColour = document.getElementById(
    'player-1-paddle-colour-input',
  ) as HTMLInputElement;
  if (player1PaddleColour) {
    console.log(player1PaddleColour.value);
    settings.paddleColour1 = player1PaddleColour.value;
  } else console.warn('Player 1 paddle colour input form not found');

  if (settings.gameType === 'Crazy Pong') {
    settings.character1 = characterList[currentCharacterIndex1];
  }

  if (settings.playType === 'Local Play') {
    const player2InputAlias = document.getElementById('player-2-alias') as HTMLInputElement;
    if (player2InputAlias) settings.alias2 = player2InputAlias.value;
    else console.warn('Player 2 alias input form not found');

    const player2PaddleColour = document.getElementById(
      'player-2-paddle-colour-input',
    ) as HTMLInputElement;
    if (player2PaddleColour) settings.paddleColour2 = player2PaddleColour.value;
    else console.warn('Player 2 paddle colour input form not found');

    if (settings.gameType === 'Crazy Pong') {
      settings.character2 = characterList[currentCharacterIndex2];
    }
  }

  settings.background = backgroundList[backgroundIndex];
}

/**
 * @brief Retrieves the current game settings.
 *
 * This function returns the current configuration of game settings, including game type, play type,
 * player aliases, paddle colors, and character selections.
 *
 * @return The current game settings object.
 */
export function getGameSettings(): gameSettings {
  return settings as gameSettings;
}
