/**
 * @file endGameMenu.ts
 * @brief Handles the end game menu logic, including updating stats, hiding game elements, and managing UI transitions.
 */

import { Player } from './player.js';
import { stats } from './game.js';
import { loadView } from './../../../core/viewLoader.js';
import { getGameSettings } from '../gameSetup.js';
import { fadeIn, fadeOut } from '../../../ui/animations.js';
import { forceRouteChange } from '../../../core/router.js';

/**
 * @brief Triggers the end game menu for the winning player.
 * @param winningPlayer The player who won the game.
 */
export function triggerEndGameMenu(winningPlayer: Player): void {
  const winnerHUD = document.getElementById(`${winningPlayer.side}-hud`);
  if (!winnerHUD) {
    console.warn('No winner HUD');
    return;
  }

  const colour = getPlayerAvatarColour(winningPlayer.side);
  if (!colour) {
    console.warn("Couldn't find correct colour");
    return;
  }

  winnerHUD.classList.remove('w-1/6');
  winnerHUD.classList.add('ml-6');
  const winnerHUDcopy = winnerHUD.cloneNode(true);

  hideGameElements();
  showStatsMenu(winnerHUDcopy, winningPlayer.side, colour);
  updateButtons();
}

/**
 * @brief Hides game elements such as the game container and HUDs.
 */
function hideGameElements(): void {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    console.warn('No game container');
    return;
  }

  const leftHUD = document.getElementById(`left-hud`);
  if (!leftHUD) {
    console.warn("Couldn't find losing HUD");
    return;
  }

  const rightHUD = document.getElementById(`right-hud`);
  if (!rightHUD) {
    console.warn("Couldn't find losing HUD");
    return;
  }

  fadeOut(gameContainer);
  fadeOut(leftHUD);
  fadeOut(rightHUD);
}

/**
 * @brief Retrieves the avatar colour for the given side.
 * @param side The side of the player (e.g., 'left' or 'right').
 * @return The colour associated with the player's avatar, or undefined if not found.
 */ //TODO: Refactor??
function getPlayerAvatarColour(side: string): string | undefined {
  const classList = document.getElementById(`${side}-score-card-1`)?.className.split(' ');

  if (!classList) {
    console.warn("Couldn't find score card");
    return undefined;
  }

  const regExp = /bg-(\w+)-(\d+)/;
  return classList.find((className) => regExp.test(className))?.match(regExp)?.[1];
}

/**
 * @brief Displays the stats menu with the winner's HUD and updates its contents.
 * @param winnerHUD The cloned HUD of the winning player.
 * @param side The side of the winning player (e.g., 'left' or 'right').
 * @param colour The colour associated with the winning player.
 */
function showStatsMenu(winnerHUD: Node, side: string, colour: string): void {
  copyHUD(winnerHUD);

  const stats = document.getElementById('game-stats');
  if (!stats) {
    console.warn("Couldn't find game stats");
    return;
  }

  updateStatsColour(colour, stats);
  updateStatsContents(side);

  setTimeout(() => fadeIn(stats), 750);
}

/**
 * @brief Updates the colour scheme of the stats menu based on the winning player's colour.
 * @param colour The colour associated with the winning player.
 * @param stats The stats menu element.
 */
function updateStatsColour(colour: string, stats: HTMLElement): void {
  const colouredText = stats.querySelectorAll('.text-green-400');
  colouredText.forEach((element) => {
    element.classList.remove('text-green-400');
    element.classList.add(`text-${colour}-400`);
  });

  stats.classList.remove('border-green-500');
  stats.classList.add(`border-${colour}-500`);

  stats.classList.remove('hover:shadow-green-500/30');
  stats.classList.add(`hover:shadow-${colour}-500/30`);
}

/**
 * @brief Updates the contents of the stats menu with the winning player's statistics.
 * @param side The side of the winning player (e.g., 'left' or 'right').
 */
function updateStatsContents(side: string): void {
  const goalScored = document.getElementById('goals-scored-result');
  if (!goalScored) {
    console.warn('No goals scored element found');
    return;
  }

  const goalsSuffered = document.getElementById('goals-suffered-result');
  if (!goalsSuffered) {
    console.warn('No goals suffered element found');
    return;
  }

  const goalsSaved = document.getElementById('saves-result');
  if (!goalsSaved) {
    console.warn('No goals saved element found');
    return;
  }

  const powersUsed = document.getElementById('powers-used-result');
  if (!powersUsed) {
    console.warn('No powers used element found');
    return;
  }

  const maxBallSpeed = document.getElementById('max-ball-speed-result');
  if (!maxBallSpeed) {
    console.warn('No max ball speed element found');
    return;
  }

  let winnerStats = side === 'left' ? stats.left : stats.right;
  goalScored.innerText = String(winnerStats.goals);
  goalsSuffered.innerText = String(winnerStats.sufferedGoals);
  goalsSaved.innerText = String(winnerStats.saves);
  powersUsed.innerText = String(winnerStats.powersUsed);
  maxBallSpeed.innerText = String(Math.trunc(stats.maxSpeed));
}

/**
 * @brief Replaces the player identifier element with the winner's HUD.
 * @param winnerHUD The cloned HUD of the winning player.
 */
function copyHUD(winnerHUD: Node): void {
  const playerIdentifier = document.getElementById('player-identifier');

  if (!playerIdentifier) {
    console.warn("Couldn't find player identifier");
    return;
  }

  playerIdentifier.replaceWith(winnerHUD);
}

/**
 * @brief Updates the buttons in the end game menu, such as the "Play Again" button.
 */
function updateButtons(): void {
  const playType = getGameSettings().playType;

  let targetPage: string;
  if (playType === 'Local Play') targetPage = 'local-play-page';
  else if (playType === 'Remote Play') targetPage = 'remote-play-page';
  // TODO: What if tournament?
  //
  const playAgainButton = document.getElementById('play-again-button');
  if (playAgainButton) {
    playAgainButton.addEventListener('click', () => {
      loadView(targetPage);
      forceRouteChange(targetPage);
    });
  } else console.warn('Play Again Button not found');
}

/**
 * @brief Retrieves the avatar colour for the given side.
 * @param side The side of the player (e.g., 'left' or 'right').
 * @return The colour associated with the player's avatar, or undefined if not found.
 */
function getColour(side: string): string | undefined {
  const classList = document.getElementById(`${side}-score-card-1`)?.className.split(' ');

  if (!classList) {
    console.warn("Couldn't find score card");
    return undefined;
  }

  const regExp = /bg-(\w+)-(\d+)/;
  return classList.find((className) => regExp.test(className))?.match(regExp)?.[1];
}
