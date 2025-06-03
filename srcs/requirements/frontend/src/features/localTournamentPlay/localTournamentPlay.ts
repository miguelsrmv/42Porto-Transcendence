/**
 * @file tournamentPlay.ts
 * @brief Handles the setup of the tournamnet play page.
 */

import type { gameType } from '../game/gameSettings/gameSettings.types.js';

import {
  getGameType,
  createCharacterLoop,
  setGameSettings,
  getLeanGameSettings,
} from '../game/gameSetup.js';
import { initializeRemoteGame } from '../game/remoteGameApp/remoteGame.js';
import { checkLoginStatus, wait } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { fadeIn, fadeOut } from '../../ui/animations.js';

/**
 * @brief Initializes view for tournament play
 *
 * This function sets up the view for tournament play
 */
export async function initializeView(): Promise<void> {
  if (!(await checkLoginStatus())) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }

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

  // Hidens Player 2 settings
  const player2Settings = document.getElementById('player-2-settings');
  if (player2Settings) player2Settings.classList.add('hidden');
  else console.warn('Player 2 settings menu not found');

  // Hides background settings
  const backgroundSettings = document.getElementById('board-settings-content');
  if (backgroundSettings) backgroundSettings.classList.add('hidden');
  else console.warn('Background settings menu not found');

  // If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
  if (gameType === 'Crazy Pong') {
    // Unhides character selection
    const characterSelect1 = document.getElementById('player-1-character');
    if (characterSelect1) characterSelect1.classList.remove('hidden');
    else console.warn('Character Select 1 not found.');

    // Creates character loop (for both players)
    createCharacterLoop();
  }

  const playButton = document.getElementById('play-button');
  if (playButton) {
    playButton.innerText = 'Play Tournament!';
    playButton.addEventListener('click', () => {
      setGameSettings(gameType, 'Tournament Play');
      showWaitingModal();
      initializeRemoteGame(getLeanGameSettings());
    });
  } else console.warn('Play Button not found');
}

async function showWaitingModal(): Promise<void> {
  const gameSettingsMenu = document.getElementById('game-settings-menu');
  if (!gameSettingsMenu) {
    console.log('Game settings menu not found');
    return;
  }

  const playButtonContainer = document.getElementById('play-button-container');
  if (!playButtonContainer) {
    console.log('Play Button Container not found');
    return;
  }

  fadeOut(gameSettingsMenu);
  fadeOut(playButtonContainer);

  const waitingModal = document.getElementById('waiting-game-modal');
  if (!waitingModal) {
    console.log('Waiting modal not found');
    return;
  }

  setTimeout(() => fadeIn(waitingModal), 750);

  await wait(1);

  waitingModal.classList.remove('animate-fade-in');
  waitingModal.classList.add('animate-pulse');
}
