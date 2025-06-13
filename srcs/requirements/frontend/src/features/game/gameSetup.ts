/**
 * @file gameSetup.ts
 * @brief Handles the setup of game types, character selection, and background selection for the game.
 *
 * This module provides functions to configure game settings, including selecting game types,
 * characters, and backgrounds. It also manages user interactions for these selections.
 */

import type {
  gameType,
  playType,
  gameSettings,
  leanGameSettings,
} from './gameSettings/gameSettings.types.js';
import type { character } from './characterData/characterData.types.js';
import { getCharacterList } from './characterData/characterData.js';
import { getBackgroundList } from './backgroundData/backgroundData.js';
export type gameSettingKey =
  | 'playType'
  | 'gameType'
  | 'player1Alias'
  | 'player1Avatar'
  | 'player1PaddleColour'
  | 'player1Character'
  | 'player2Alias'
  | 'player2Avatar'
  | 'player2PaddleColour'
  | 'player2Character'
  | 'background'
  | 'gameType';

/**
 * @brief Partial settings object to store game configurations.
 */
const settings: Partial<gameSettings> = {};

/**
 * @brief Index for current character sleections of players 1 to 8.
 */
let currentCharacterIndex1: number = 0;
let currentCharacterIndex2: number = 0;
let currentCharacterIndex3: number = 0;
let currentCharacterIndex4: number = 0;
let currentCharacterIndex5: number = 0;
let currentCharacterIndex6: number = 0;
let currentCharacterIndex7: number = 0;
let currentCharacterIndex8: number = 0;

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
    const playButton = document.getElementById('play-button');

    if (classicButton && crazyButton && playButton) {
      classicButton.addEventListener(
        'click',
        () => {
          playButton.classList.remove('hidden');
          resolve('Classic Pong');
        },
        { once: true },
      );
      crazyButton.addEventListener(
        'click',
        () => {
          playButton.classList.remove('hidden');
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
  const characterMoveName: HTMLDivElement | null = document.getElementById(
    `character-move-name-${player_number}`,
  ) as HTMLDivElement;
  const characterMoveHelp: HTMLDivElement | null = document.getElementById(
    `character-move-help-${player_number}`,
  ) as HTMLDivElement;

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
    } else if (player_number === 3) {
      currentCharacterIndex3 = currentCharacterIndex;
    } else if (player_number === 4) {
      currentCharacterIndex4 = currentCharacterIndex;
    } else if (player_number === 5) {
      currentCharacterIndex5 = currentCharacterIndex;
    } else if (player_number === 6) {
      currentCharacterIndex6 = currentCharacterIndex;
    } else if (player_number === 7) {
      currentCharacterIndex7 = currentCharacterIndex;
    } else if (player_number === 8) {
      currentCharacterIndex8 = currentCharacterIndex;
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
    if (characterMoveName && characterMoveHelp) {
      characterMoveName.innerText = `Special Move: ${characterList[currentCharacterIndex].attack}`;
      characterMoveHelp.innerText = `${characterList[currentCharacterIndex].selectHelpMessage}`;
    }
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
    const inputValue = player1InputAlias.value.trim();
    settings.alias1 = inputValue !== '' ? inputValue : getPlayer1Alias();
  } else console.warn('Player 1 alias input form not found');

  const player1PaddleColour = document.getElementById(
    'player-1-paddle-colour-input',
  ) as HTMLInputElement;
  if (player1PaddleColour) {
    settings.paddleColour1 = player1PaddleColour.value;
  } else console.warn('Player 1 paddle colour input form not found');

  if (settings.gameType === 'Crazy Pong') {
    settings.character1 = characterList[currentCharacterIndex1];
  } else {
    settings.character1 = null;
    settings.character2 = null;
  }

  if (settings.playType === 'Local Play') {
    const player1AvatarPath = window.localStorage.getItem('AvatarPath');
    if (player1AvatarPath) settings.avatar1 = player1AvatarPath;
    if (player1AvatarPath) settings.avatar2 = player1AvatarPath;

    const player2InputAlias = document.getElementById('player-2-alias') as HTMLInputElement;
    if (player2InputAlias) {
      const inputValue2 = player2InputAlias.value.trim();
      settings.alias2 = inputValue2 !== '' ? inputValue2 : 'Opponent';
    } else console.warn('Player 2 alias input form not found');

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

function getPlayer1Alias(): string {
  const aliasName = window.localStorage.getItem('Username');

  if (!aliasName) return 'Player';

  return aliasName;
}

/**
 * @brief Retrieves the current game settings.
 *
 * This function returns the current configuration of game settings, including game type, play type,
 * player aliases, paddle colors, and character selections.
 *
 * @return The current game settings object for 2 players.
 */
export function getGameSettings(): gameSettings {
  return settings as gameSettings;
}

/**
 * @brief Retrieves the current game settings for 1-player mode.
 *
 * This function returns the current configuration of game settings, including game type, play type,
 * player alias, paddle colors, and character selections.
 *
 * @return The current game settings object for remote play.
 */
export function getLeanGameSettings(): leanGameSettings {
  let fullSettings: gameSettings = getGameSettings();

  let leanGameSettings: leanGameSettings = {
    playerID: window.localStorage.getItem('ID') as string,
    playType: fullSettings.playType,
    gameType: fullSettings.gameType,
    alias: fullSettings.alias1,
    paddleColour: fullSettings.paddleColour1,
    character: fullSettings.character1,
  };

  return leanGameSettings;
}

export function updateHUD(gameSettings: gameSettings, gameType: gameType): void {
  const leftAlias = document.getElementById('left-alias');
  if (leftAlias) leftAlias.innerText = gameSettings.alias1;

  const rightAlias = document.getElementById('right-alias');
  if (rightAlias) rightAlias.innerText = gameSettings.alias2;

  const leftAvatar = document.getElementById('left-player-avatar') as HTMLImageElement;
  leftAvatar.src = gameSettings.avatar1;

  const rightAvatar = document.getElementById('right-player-avatar') as HTMLImageElement;
  rightAvatar.src = gameSettings.avatar2;

  if (gameType == 'Crazy Pong') {
    const leftCharacter = gameSettings.character1;
    const rightCharacter = gameSettings.character2;

    const leftCharHUD = document.getElementById('left-character-hud');
    if (leftCharHUD) leftCharHUD.classList.toggle('hidden');

    const leftPortrait = document.getElementById('left-character-portrait') as HTMLImageElement;
    if (leftPortrait) leftPortrait.src = leftCharacter?.characterAvatarPicturePath as string;

    const leftHUD = document.getElementById('left-hud');
    if (leftHUD) {
      const redElements = leftHUD?.querySelectorAll('.bg-red-500');

      redElements.forEach((el) => {
        el.classList.remove('bg-red-500');
        el.classList.add(`bg-${leftCharacter?.accentColour}-500`);
      });

      const redBorderedElements = leftHUD?.querySelectorAll('.border-red-500');

      redBorderedElements.forEach((el) => {
        el.classList.remove('border-red-500');
        el.classList.add(`border-${leftCharacter?.accentColour}-500`);
      });
    }

    const rightCharHUD = document.getElementById('right-character-hud');
    if (rightCharHUD) rightCharHUD.classList.toggle('hidden');

    const rightPortrait = document.getElementById('right-character-portrait') as HTMLImageElement;
    if (rightPortrait) rightPortrait.src = rightCharacter?.characterAvatarPicturePath as string;

    const rightHUD = document.getElementById('right-hud');
    if (rightHUD) {
      const blueElements = rightHUD?.querySelectorAll('.bg-blue-500');

      blueElements.forEach((el) => {
        el.classList.remove('bg-blue-500');
        el.classList.add(`bg-${rightCharacter?.accentColour}-500`);
      });

      const blueBordeblueElements = rightHUD?.querySelectorAll('.border-blue-500');

      blueBordeblueElements.forEach((el) => {
        el.classList.remove('border-blue-500');
        el.classList.add(`border-${rightCharacter?.accentColour}-500`);
      });
    }
  }
}

export function getCharacterIndex(i: number): number {
  if (i == 1) return currentCharacterIndex1;
  else if (i === 2) return currentCharacterIndex2;
  else if (i === 3) return currentCharacterIndex3;
  else if (i === 4) return currentCharacterIndex4;
  else if (i === 5) return currentCharacterIndex5;
  else if (i === 6) return currentCharacterIndex6;
  else if (i === 7) return currentCharacterIndex7;
  else return currentCharacterIndex8;
}
