/**
 * @file localPlay.ts
 * @brief Handles the setup of the local play page.
 */

import type { gameType } from '../game/gameSettings/gameSettings.types.js';

import {
  getGameType,
  createBackgroundLoop,
  createCharacterLoop,
  setGameSettings,
  getGameSettings,
  updateHUD,
} from '../game/gameSetup.js';

import { initializeLocalGame } from '../game/localGameApp/game.js';

import { loadView } from '../../core/viewLoader.js';

/**
 * @brief Initializes view for local play
 *
 * This function sets up the pre-game page for local play
 */
export async function initializeView(): Promise<void> {
  // Gets Classic or Crazy Pong
  const gameType: gameType = await getGameType();

  // Hides game type menu
  const gameTypeSelection = document.getElementById('game-type-selection');
  if (gameTypeSelection) gameTypeSelection.classList.add('hidden');
  else console.warn('Game Type Selection not found.');

  // Shows game settings menu
  const gameSettingsMenu = document.getElementById('game-settings-menu');
  if (gameSettingsMenu) gameSettingsMenu.classList.remove('hidden');
  else console.warn('Game Settings Menu not found.');

  // If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
  if (gameType === 'Crazy Pong') {
    for (let i: number = 1; i <= 2; i++) {
      // Unhides character selection
      const characterSelect = document.getElementById(`player-${i}-character`);
      if (characterSelect) characterSelect.classList.remove('hidden');
      else console.warn(`Character Select ${i} not found.`);

      // Creates character loop
      createCharacterLoop(i);
    }
  }

  const playButton = document.getElementById('play-button');
  if (playButton) {
    playButton.addEventListener('click', () => {
      setGameSettings(gameType, 'Local Play');
      loadView('game-page');
      updateHUD(getGameSettings(), gameType);
      initializeLocalGame(getGameSettings());
    });
  } else console.warn('Play Button not found');
}
