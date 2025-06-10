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

  editGridLayout();

  // Hides background settings
  const backgroundSettings = document.getElementById('board-settings-content');
  if (backgroundSettings) backgroundSettings.classList.add('hidden');
  else console.warn('Background settings menu not found');

  // If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
  if (gameType === 'Crazy Pong') {
    for (let i: number = 1; i <= 8; i++) {
      // Unhides character selection
      const characterSelect = document.getElementById(`player-${i}-character`);
      if (characterSelect) characterSelect.classList.remove('hidden');
      else console.warn(`Character Select ${1} not found.`);

      // Creates Character loop
      createCharacterLoop(i);
    }
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

function editGridLayout(): void {
  const settingsMenu = document.getElementById('settings-columns');
  if (!settingsMenu) {
    console.log("Couldn't find settings menu");
    return;
  }

  settingsMenu.classList.remove('flex', 'flex-row', 'h-full', 'overflow-hidden');
  settingsMenu.classList.add('grid', 'grid-cols-4', 'items-start');

  editPlayerAlias(settingsMenu);
  showOtherPlayers(settingsMenu);
  resizeGrid(settingsMenu);
}

function editPlayerAlias(settingsMenu: HTMLElement): void {
  for (let i: number = 1; i <= 2; i++) {
    const player = settingsMenu.querySelector(`#player-${i}-alias`) as HTMLInputElement;
    if (!player) {
      console.log(`Couldn't find player-${i}-alias`);
      return;
    }
    player.placeholder = `Player ${i}`;
  }
}

function showOtherPlayers(settingsMenu: HTMLElement): void {
  for (let i: number = 3; i <= 8; i++) {
    const player = settingsMenu.querySelector(`#player-${i}-settings`);
    if (!player) {
      console.log(`Couldn't find player-${i}-settings`);
      return;
    }
    player.classList.remove('hidden');
  }
}

function resizeGrid(settingsMenu: HTMLElement) {
  for (let i: number = 1; i <= 8; i++) {
    const player = settingsMenu.querySelector(`#player-${i}-settings`);
    if (!player) {
      console.log(`Couldn't find player-${i}-settings`);
      return;
    }
    player.classList.remove('p-6');
    player.classList.add('p-2');

    const playerNameSection = player.querySelector(`#player-${i}-name`);
    if (!playerNameSection) {
      console.log(`Couldn't find player-${i}-name`);
      return;
    }
    playerNameSection.classList.add('flex', 'flex-row', 'gap-2', 'justify-between', 'items-center');

    const playerAlias = player.querySelector(`#player-${i}-alias-label`);
    if (!playerAlias) {
      console.log(`Couldn't find player-${i}-alias-label`);
      return;
    }
    playerAlias.classList.remove('mb-6');

    const playerPaddleSection = player.querySelector(`#player-${i}-paddle-colour`);
    if (!playerPaddleSection) {
      console.log(`Couldn't find player-${i}-colour`);
      return;
    }
    playerPaddleSection.classList.remove('mt-6');
    playerPaddleSection.classList.add(
      'flex',
      'flex-row',
      'gap-2',
      'justify-between',
      'items-center',
      'w-3/4',
    );

    const playerPaddleLabel = player.querySelector(`#player-${i}-paddle-colour-input-label`);
    if (!playerPaddleLabel) {
      console.log(`Couldn't find player-${i}-paddle-colour-input-label`);
      return;
    }
    playerPaddleLabel.classList.remove('mb-2', 'block');

    const playerPaddleInput = player.querySelector(`#player-${i}-paddle-colour-input`);
    if (!playerPaddleInput) {
      console.log(`Couldn't find player-${i}-paddle-colour-input`);
      return;
    }
    playerPaddleInput.classList.remove('w-1/2');
    playerPaddleInput.classList.add('w-1/3');

    const playerCharacter = player.querySelector(`#player-${i}-character`);
    if (!playerCharacter) {
      console.log(`Couldn't find player-${i}-character`);
      return;
    }
    playerCharacter.classList.remove('flex-col', 'mt-6');
    playerCharacter.classList.add('flex-row', 'w-3/4', 'justify-between', 'items-center', 'gap-2');

    const prevCharacter = player.querySelector(`#prev-character-${i}`) as HTMLButtonElement;
    if (!prevCharacter) {
      console.log(`Couldn't find prev-character-${i}`);
      return;
    }

    prevCharacter.innerText = '<';

    const nextCharacter = player.querySelector(`#next-character-${i}`) as HTMLButtonElement;
    if (!nextCharacter) {
      console.log(`Couldn't find next-character-${i}`);
      return;
    }

    nextCharacter.innerText = '>';

    const characterDisplay = player.querySelector(`#character-display-${i}`);
    if (!characterDisplay) {
      console.log(`Couldn't find character-display-${i}`);
      return;
    }

    characterDisplay.classList.remove('w-48', 'h-48', 'p-3');
    characterDisplay.classList.add('w-12', 'h-12');

    const characterSelect = player.querySelector(`#character-select-${i}`);
    if (!characterSelect) {
      console.log(`Couldn't find character-select-${i}`);
      return;
    }

    characterSelect.classList.remove('gap-6');

    const helperText = player.querySelector(`#character-helper-text-${i}`);
    if (!helperText) {
      console.log(`Couldn't find character-helper-text-${i}`);
      return;
    }

    helperText.classList.add('text-xs');
    playerCharacter.after(helperText);
  }
}
