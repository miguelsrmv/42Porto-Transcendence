/**
 * @file tournamentPlay.ts
 * @brief Handles the setup of the local tournament play page.
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
import { initializeLocalGame, endLocalGameIfRunning } from '../game/localGameApp/game.js';
import { getCharacterList } from '../game/characterData/characterData.js';
import { getBackgroundList } from '../../features/game/backgroundData/backgroundData.js';
import { getAvatarList } from '../../ui/avatarData/avatarData.js';
import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { editGridLayout } from './localTournamentPlayerMenu.js';
import { getRandomInt, wait } from '../../utils/helpers.js';
import { loadView } from '../../core/viewLoader.js';
import { showTournamentStatus } from '../../ui/tournamentStatus/tournamentStatus.js';
import {
  displayTournamentTree,
  showWaitingModal,
  waitForNextTournamentGameCountdown,
} from '../../ui/waitingNextGame.js';
import { showHowToPlay } from '../../ui/controls.js';

const characterList = getCharacterList();

let tournamentSettings: tournamentSettings | undefined;

let localTournamentIsRunning: boolean = false;

/**
 * @brief Initializes the view for tournament play.
 * @details Sets up the tournament play page, handles UI, and prepares event listeners.
 * @returns Promise<void>
 */
export async function initializeView(): Promise<void> {
  showHowToPlay('Local Tournament Play');

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

/**
 * @brief Sets up tournament settings based on user input.
 * @param gameType The type of game (Classic or Crazy Pong).
 * @param playType The play mode.
 * @returns void
 */
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
      playerNumber: i,
      alias: alias,
      paddleColour: paddleColour,
      character: character,
      avatar: getRandomAvatar(),
      quarterFinalScore: '',
      semiFinalScore: '',
      finalScore: '',
      phase: TournamentPhase.Quarter,
    };

    tournamentPlayers.push(tournamentPlayer);

    tournamentSettings = {
      playType: playType,
      gameType: gameType,
      players: tournamentPlayers,
    };
  }
}

/**
 * @brief Initializes and runs the local tournament.
 * @param tournamentSettings The settings for the tournament.
 * @returns Promise<void>
 */
async function initializeLocalTournament(tournamentSettings: tournamentSettings): Promise<void> {
  let phase: TournamentPhase = TournamentPhase.Quarter;
  localTournamentIsRunning = true;
  showWaitingModal();
  showTournamentStatus(convertTournamentPlayer(tournamentSettings.players));
  await wait(5);

  for (let match = 1; match <= 7; match++) {
    if (!localTournamentIsRunning) return;
    if (match === 5) phase = TournamentPhase.Semi;
    else if (match === 7) {
      phase = TournamentPhase.Final;
      localTournamentIsRunning = false;
    }
    const player1Number: number = getPlayerNumber(phase, tournamentSettings, 'left');
    const player2Number: number = getPlayerNumber(phase, tournamentSettings, 'right');
    loadView('game-page');
    const gameSettings = createGameSettings(tournamentSettings, player1Number, player2Number);
    updateHUD(gameSettings, gameSettings.gameType);
    const waitForGameEnd = listenToGameEnd(
      tournamentSettings,
      match,
      phase,
      player1Number,
      player2Number,
    );
    endLocalGameIfRunning();
    initializeLocalGame(gameSettings, localTournamentIsRunning);
    await waitForGameEnd;
    if (match === 4 || match === 6) await displayTournamentTree();
    await waitForNextTournamentGameCountdown();
  }
}

/**
 * @brief Creates game settings for a match between two players.
 * @param tournamentSettings The tournament settings.
 * @param player1Number Index of player 1.
 * @param player2Number Index of player 2.
 * @returns gameSettings Object containing settings for the match.
 */
function createGameSettings(
  tournamentSettings: tournamentSettings,
  player1Number: number,
  player2Number: number,
): gameSettings {
  const player1 = tournamentSettings.players[player1Number];
  const player2 = tournamentSettings.players[player2Number];
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

/**
 * @brief Gets the player number for a given phase and side.
 * @param phase The current tournament phase.
 * @param tournamentSettings The tournament settings.
 * @param playerSide 'left' or 'right' side.
 * @returns number Index of the player.
 */
function getPlayerNumber(
  phase: TournamentPhase,
  tournamentSettings: tournamentSettings,
  playerSide: string,
): number {
  let index: number = 0;
  let count = playerSide == 'left' ? 1 : 2;
  const players: tournamentPlayerSettings[] = tournamentSettings.players;
  if (phase == TournamentPhase.Quarter) {
    while (index < players.length) {
      if (
        players[index].quarterFinalScore == '' &&
        players[index].phase == TournamentPhase.Quarter
      ) {
        count--;
      }
      if (!count) return index;
      index++;
    }
  } else if (phase == TournamentPhase.Semi) {
    while (index < players.length) {
      if (players[index].semiFinalScore == '' && players[index].phase == TournamentPhase.Semi) {
        count--;
      }
      if (!count) return index;
      index++;
    }
  } else {
    while (index < players.length) {
      if (players[index].phase == TournamentPhase.Final) {
        count--;
      }
      if (!count) return index;
      index++;
    }
  }
  // HACK: Only here because of LSP
  return index;
}

/**
 * @brief Selects a random background for a match.
 * @returns background The selected background object.
 */
function getRandomBackground(): background {
  const backgroundList = getBackgroundList();

  const backgroundIndex = getRandomInt(0, backgroundList.length - 1);

  return backgroundList[backgroundIndex];
}

/**
 * @brief Selects a random avatar for a player.
 * @returns string Path to the avatar image.
 */
function getRandomAvatar(): string {
  const avatarList: avatar[] = getAvatarList();

  // NOTE: -2 to exclude "Upload your own" Avatar
  const avatarIndex = getRandomInt(0, avatarList.length - 2);

  return avatarList[avatarIndex].imagePath;
}

/**
 * @brief Listens for the end of a game and updates tournament results.
 * @param tournamentSettings The tournament settings.
 * @param matchPlayed The match number.
 * @param phase The current phase.
 * @param player1Number Index of player 1.
 * @param player2Number Index of player 2.
 * @returns Promise<gameEnd> Resolves when the game ends.
 */
function listenToGameEnd(
  tournamentSettings: tournamentSettings,
  matchPlayed: number,
  phase: TournamentPhase,
  player1Number: number,
  player2Number: number,
): Promise<gameEnd> {
  return new Promise((resolve) => {
    const eventHandler = (event: CustomEvent<gameEnd>) => {
      updateTournamentResults(
        tournamentSettings,
        phase,
        player1Number,
        player2Number,
        event.detail.matchStats,
      );
      if (matchPlayed === 4 || matchPlayed == 6) {
        showTournamentStatus(convertTournamentPlayer(tournamentSettings.players));
      }
      resolve(event.detail);
    };

    window.addEventListener('game:end', eventHandler, { once: true });
  });
}

/**
 * @brief Updates tournament results after a match.
 * @param tournamentSettings The tournament settings.
 * @param phase The current phase.
 * @param player1Number Index of player 1.
 * @param player2Number Index of player 2.
 * @param matchStats The statistics of the match.
 * @returns void
 */
function updateTournamentResults(
  tournamentSettings: tournamentSettings,
  phase: TournamentPhase,
  player1Number: number,
  player2Number: number,
  matchStats: gameStats,
): void {
  if (phase == TournamentPhase.Quarter) {
    tournamentSettings.players[player1Number].quarterFinalScore = matchStats.left.goals.toString();
    tournamentSettings.players[player2Number].quarterFinalScore = matchStats.right.goals.toString();
    matchStats.left.goals > matchStats.right.goals
      ? (tournamentSettings.players[player1Number].phase = TournamentPhase.Semi)
      : (tournamentSettings.players[player2Number].phase = TournamentPhase.Semi);
  } else if (phase == TournamentPhase.Semi) {
    tournamentSettings.players[player1Number].semiFinalScore = matchStats.left.goals.toString();
    tournamentSettings.players[player2Number].semiFinalScore = matchStats.right.goals.toString();
    matchStats.left.goals > matchStats.right.goals
      ? (tournamentSettings.players[player1Number].phase = TournamentPhase.Final)
      : (tournamentSettings.players[player2Number].phase = TournamentPhase.Final);
  }
  if (phase == TournamentPhase.Final) {
    tournamentSettings.players[player1Number].finalScore = matchStats.left.goals.toString();
    tournamentSettings.players[player2Number].finalScore = matchStats.right.goals.toString();
  }
}

/**
 * @brief Converts internal player settings to tournament player objects for UI.
 * @param players Array of tournamentPlayerSettings.
 * @returns tournamentPlayer[] Array of tournament player objects.
 */
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

/**
 * @brief Ends the local tournament if it is running.
 * @returns void
 */
export function endLocalTournamentIfRunning(): void {
  localTournamentIsRunning = false;
}
