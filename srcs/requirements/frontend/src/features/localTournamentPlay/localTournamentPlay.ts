/**
 * @file tournamentPlay.ts
 * @brief Handles the setup of the tournamnet play page.
 */

import type {
  gameType,
  playType,
  tournamentSettings,
  tournamentPlayerSettings,
} from '../game/gameSettings/gameSettings.types.js';

import {
  getGameType,
  createCharacterLoop,
  getGameSettings,
  getCharacterIndex,
} from '../game/gameSetup.js';
import { initializeLocalGame } from '../game/localGameApp/game.js';
import { getCharacterList } from '../game/characterData/characterData.js';
import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { editGridLayout } from './localTournamentPlayerMenu.js';

let tournamentSettings: tournamentSettings | undefined;

const characterList = getCharacterList();

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
      setTournamentSettings(gameType, 'Local Tournament Play');
    });
  } else console.warn('Play Button not found');
}

function setTournamentSettings(gameType: gameType, playType: playType): void {
  let tournamentPlayers: tournamentPlayerSettings[] = [];

  for (let i: number = 1; i <= 8; i++) {
    const playerInputAlias = document.getElementById(`player-${i}-alias`) as HTMLInputElement;
    if (!playerInputAlias) {
      console.log(`Player input alias ${i} not found`);
      return;
    }

    const aliasValue = playerInputAlias.value.trim();
    const alias = aliasValue === '' ? `Player ${i}` : aliasValue;

    const playerPaddleColour = document.getElementById(
      `player-${i}-paddle-colour-input`,
    ) as HTMLInputElement;
    if (!playerInputAlias) {
      console.log(`Player paddle colour ${i} not found`);
      return;
    }

    const paddleColour = playerPaddleColour.value;

    let character;
    if (gameType === 'Crazy Pong') {
      character = characterList[getCharacterIndex(i)];
    } else character = null;
  }
  //
  //   let tournamentPlayer : tournamentPlayerSettings = {
  //     alias: alias,
  //     paddleColour: paddleColour;
  //
  //   };
  //
  // tournamentSettings = {
  //   playType: playType,
  //   gameType: gameType,
  //   players: tournamentPlayers,
  // };
}
