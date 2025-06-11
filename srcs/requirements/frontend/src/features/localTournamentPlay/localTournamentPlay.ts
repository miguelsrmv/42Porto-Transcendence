/**
 * @file tournamentPlay.ts
 * @brief Handles the setup of the tournamnet play page.
 */

import type {
  gameType,
  playType,
  tournamentSettings,
  tournamentPlayerSettings,
  gameSettings,
} from '../game/gameSettings/gameSettings.types.js';

import type { background } from '../game/backgroundData/backgroundData.types.js';

import type { avatar } from '../../ui/avatarData/avatarData.types.js';

import type { gameEnd } from './localTournamentPlay.events.js';

import type { gameStats } from '../game/gameStats/gameStatsTypes.js';

import { TournamentPhase } from '../../ui/tournamentStatus/tournamentStatus.types.js';

import type { tournamentPlayer } from '../../ui/tournamentStatus/tournamentStatus.types.js';

import {
  getGameType,
  createCharacterLoop,
  getCharacterIndex,
  updateHUD,
} from '../game/gameSetup.js';
import { initializeLocalGame } from '../game/localGameApp/game.js';
import { getCharacterList } from '../game/characterData/characterData.js';
import { getBackgroundList } from '../../features/game/backgroundData/backgroundData.js';
import { getAvatarList } from '../../ui/avatarData/avatarData.js';
import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { editGridLayout } from './localTournamentPlayerMenu.js';
import { getRandomInt, wait } from '../../utils/helpers.js';
import { loadView } from '../../core/viewLoader.js';
import { showTournamentStatus } from '../../ui/tournamentStatus/tournamentStatus.js';

let tournamentSettings: tournamentSettings | undefined;

const characterList = getCharacterList();

let match: number = 1;

let phase: TournamentPhase = TournamentPhase.Quarter;

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

  // Resets variable on page load
  resetVariables();

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
    playButton.addEventListener('click', async () => {
      setTournamentSettings(gameType, 'Local Tournament Play');
      await initializeLocalTournament(tournamentSettings as tournamentSettings);
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

    let tournamentPlayer: tournamentPlayerSettings = {
      alias: alias,
      paddleColour: paddleColour,
      character: character,
      avatar: getRandomAvatar(),
      quarterFinalScore: '',
      semiFinalScore: '',
      finalScore: '',
    };

    tournamentPlayers.push(tournamentPlayer);

    tournamentSettings = {
      playType: playType,
      gameType: gameType,
      players: tournamentPlayers,
    };
  }
}

async function initializeLocalTournament(tournamentSettings: tournamentSettings): Promise<void> {
  let tournamentIsRunning: boolean = true;

  for (let match = 1; match <= 7; match++) {
    const gameSettings = createGameSettings(match, phase, tournamentSettings);
    loadView('game-page');
    updateHUD(gameSettings, gameSettings.gameType);
    if (match === 7) tournamentIsRunning = false;
    const waitForGameEnd = listenToGameEnd(tournamentSettings);
    initializeLocalGame(gameSettings, tournamentIsRunning);
    await waitForGameEnd;
    await wait(5);
  }
}

function createGameSettings(
  match: number,
  phase: TournamentPhase,
  tournamentSettings: tournamentSettings,
): gameSettings {
  const player1: tournamentPlayerSettings = getLeftPlayer(match, phase, tournamentSettings);
  const player2: tournamentPlayerSettings = getRightPlayer(match, phase, tournamentSettings);
  const background: background = getRandomBackground();
  const gameSettings: gameSettings = {
    playType: tournamentSettings.playType,
    gameType: tournamentSettings.gameType,
    alias1: player1.alias,
    alias2: player2.alias,
    avatar1: player1.avatar,
    avatar2: player2.avatar,
    paddleColour1: player1.paddleColour,
    paddleColour2: player2.paddleColour,
    character1: player1.character,
    character2: player2.character,
    background: background,
  };
  return gameSettings;
}

function getLeftPlayer(
  match: number,
  phase: TournamentPhase,
  tournamentSettings: tournamentSettings,
): tournamentPlayerSettings {
  return tournamentSettings.players[0];
}

function getRightPlayer(
  match: number,
  phase: TournamentPhase,
  tournamentSettings: tournamentSettings,
): tournamentPlayerSettings {
  return tournamentSettings.players[1];
}

function getRandomBackground(): background {
  const backgroundList = getBackgroundList();

  const backgroundIndex = getRandomInt(0, backgroundList.length - 1);

  return backgroundList[backgroundIndex];
}

function getRandomAvatar(): string {
  const avatarList: avatar[] = getAvatarList();

  const avatarIndex = getRandomInt(0, avatarList.length - 1);

  return avatarList[avatarIndex].imagePath;
}

function resetVariables(): void {
  match = 1;
  tournamentSettings = undefined;
  phase = TournamentPhase.Quarter;
}

// This function wraps the event listener in a Promise.
function listenToGameEnd(tournamentSettings: tournamentSettings): Promise<gameEnd> {
  return new Promise((resolve) => {
    const eventHandler = (event: CustomEvent<gameEnd>) => {
      updateTournamentResults(tournamentSettings, event.detail.matchStats);
      showTournamentStatus(convertTournamentPlayer(tournamentSettings.players));
      resolve(event.detail);
    };

    window.addEventListener('game:end', eventHandler, { once: true });
  });
}

function updateTournamentResults(
  tournamentSettings: tournamentSettings,
  matchStats: gameStats,
): void {}

function convertTournamentPlayer(players: tournamentPlayerSettings[]): tournamentPlayer[] {
  let tournamentPlayers: tournamentPlayer[] = [];

  for (let i = 0; i < players.length; i++) {
    const tournamentPlayer: tournamentPlayer = {
      userAlias: players[i].alias,
      quarterFinalScore: players[i].quarterFinalScore,
      semiFinalScore: players[i].semiFinalScore,
      finalScore: players[i].finalScore,
      avatarPath: players[i].avatar,
    };
    tournamentPlayers.push(tournamentPlayer);
  }

  return tournamentPlayers;
}
