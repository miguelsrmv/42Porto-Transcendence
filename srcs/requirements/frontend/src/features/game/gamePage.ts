import { initializeGame } from './gameApp/game.js';
import { getGameSettings } from './gameSetup.js';
import type { character } from './characterData/characterData.types.js';

/**
 * @file gamePage.ts
 * @brief Initializes the game page view.
 *
 * This module is responsible for setting up the game page by initializing the game
 * and preparing any necessary event listeners or UI components.
 */

/**
 * @brief Initializes the view for the game page.
 *
 * This function calls the `initializeGame` function to set up the game environment.
 * It is responsible for preparing the game page for user interaction.
 */
export function initializeView(): void {
  // TODO: Why is portrait showing up in Classic Pong ??
  const gameSettings = getGameSettings();
  if (gameSettings.gameType === 'Crazy Pong')
    updateHUD(gameSettings.character1, gameSettings.character2);
  // TODO: Add logic if Remote game
  // TODO: Add logic if Tournament game
  initializeGame(gameSettings);
}

function updateHUD(
  leftCharacter: character | undefined,
  rightCharacter: character | undefined,
): void {
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
