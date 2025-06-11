/**
 * @file gameConclusion.ts
 * @brief Handles the end game menu and statistics display for the game.
 */

import type { gameStats } from './gameStatsTypes.js';
import type { playType } from '../gameSettings/gameSettings.types.js';
import { fadeOut, fadeIn } from '../../../ui/animations.js';
import { loadView } from '../../../core/viewLoader.js';
import { forceRouteChange } from '../../../core/router.js';
import { waitForNextGame } from '../../../ui/waitingNextGame.js';
import { readyForNextGame } from '../remoteGameApp/remoteGame.js';
import type { gameEnd } from '../../localTournamentPlay/localTournamentPlay.events.js';

/**
 * @brief Triggers the end game menu for the winning player.
 * @param winningPlayerSide The side of the player who won the game.
 * @param playerSide The side of the current player.
 * @param stats The game statistics.
 * @param playType The type of play (e.g., Local Play, Remote Play).
 */
export function triggerEndGameMenu(
  winningPlayerSide: string,
  playerSide: string,
  stats: gameStats,
  playType: playType,
  tournamentIsRunning: boolean = false,
): void {
  const HUDSideToShow =
    playType === 'Local Play' || 'Local Tournament Play' ? winningPlayerSide : playerSide;

  const playerHUD = document.getElementById(`${HUDSideToShow}-hud`);
  if (!playerHUD) {
    console.warn('No winner HUD');
    return;
  }

  const colour = getAvatarColour(playerSide);
  if (!colour) {
    console.warn("Couldn't find correct colour");
    return;
  }

  playerHUD.classList.remove('w-1/6');
  playerHUD.classList.add('ml-6');
  const playerHUDcopy = playerHUD.cloneNode(true);

  hideGameElements();
  showStatsMenu(HUDSideToShow, stats, playerHUDcopy, colour, HUDSideToShow === winningPlayerSide);
  // TODO: Remove is it's working properly. Workaround because I didn't get tournament_end before
  // if (tournamentIsRunning) tournamentIsRunning = winningPlayerSide === playerSide;
  updateButtons(playType, tournamentIsRunning, stats);
}

/**
 * @brief Retrieves the avatar colour for the given side.
 * @param side The side of the player (e.g., 'left' or 'right').
 * @return The colour associated with the player's avatar, or undefined if not found.
 */
function getAvatarColour(side: string): string | undefined {
  const classList = document.getElementById(`${side}-score-card-1`)?.className.split(' ');

  if (!classList) {
    console.warn("Couldn't find score card");
    return undefined;
  }

  const regExp = /(\w+)-(\w+)-(\d+)/;
  return classList.find((className) => regExp.test(className))?.match(regExp)?.[2];
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
 * @brief Displays the statistics menu for the game.
 * @param HUDSideToShow The side of the HUD to show.
 * @param stats The game statistics.
 * @param playerHUDCopy A copy of the player's HUD.
 * @param colour The colour associated with the winning player.
 * @param loseMessage Whether to display a losing message.
 */
function showStatsMenu(
  HUDSideToShow: string,
  stats: gameStats,
  playerHUDCopy: Node,
  colour: string,
  winMessage: boolean,
): void {
  copyHUD(playerHUDCopy);

  const statsElement = document.getElementById('game-stats');
  if (!stats) {
    console.warn("Couldn't find game stats");
    return;
  }

  updateStatsColour(colour, statsElement as HTMLElement);
  updateStatsContents(stats, HUDSideToShow);
  updateTopMessage(winMessage);

  setTimeout(() => fadeIn(statsElement as HTMLElement), 750);
}

/**
 * @brief Updates the colour scheme of the stats menu based on the winning player's colour.
 * @param colour The colour associated with the winning player.
 * @param stats The stats menu element.
 */
function updateStatsColour(colour: string, stats: HTMLElement): void {
  const colouredText = stats.querySelectorAll('.text-colour-placeholder');
  colouredText.forEach((element) => {
    element.classList.add(`text-${colour}-400`);
  });

  stats.classList.add(`border-${colour}-500`);

  stats.classList.add(`hover:shadow-${colour}-500/30`);
}

/**
 * @brief Updates the contents of the stats menu with the winning player's statistics.
 * @param stats The game statistics.
 * @param side The side of the winning player (e.g., 'left' or 'right').
 */
function updateStatsContents(stats: gameStats, side: string): void {
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
 * @param playType The type of play (e.g., Local Play, Remote Play).
 */
function updateButtons(playType: playType, tournamentIsRunning: boolean, stats: gameStats): void {
  const playAgainButton = document.getElementById('play-again-button');
  if (!playAgainButton) {
    console.log("Couldn't find Play Again Button");
    return;
  }

  let targetPage: string | null;
  if (playType === 'Local Play') targetPage = 'local-play-page';
  else if (playType === 'Remote Play') targetPage = 'remote-play-page';
  else {
    targetPage = null;
    if (tournamentIsRunning) playAgainButton.innerText = 'Next game!';
    else playAgainButton.classList.add('hidden');
  }

  async function onPlayAgainClick() {
    console.log('Triggered!');
    restoreGameElements();
    if (targetPage) {
      loadView(targetPage);
      forceRouteChange(targetPage);
    } else {
      await waitForNextGame(); // TODO: Check why stats are reappearing
      if (playType === 'Remote Tournament Play') {
        readyForNextGame();
      } else if (playType === 'Local Tournament Play') {
        dispatchNextMatchEvent(stats);
      }
    }
    playAgainButton!.removeEventListener('click', onPlayAgainClick);
  }

  playAgainButton.removeEventListener('click', onPlayAgainClick);
  playAgainButton.addEventListener('click', onPlayAgainClick);
}

/**
 * @brief Updates the top message in the stats menu.
 * @param loseMessage Whether to display a losing message.
 */
function updateTopMessage(winMessage: boolean): void {
  const messageDiv = document.getElementById('winner');
  if (!messageDiv) {
    console.warn('No message div found');
    return;
  }
  if (!winMessage) messageDiv.innerText = 'You lost...';
}

/**
 * @brief Restores the game elements to their initial state by resetting the score cards' styles.
 */
function restoreGameElements(): void {
  for (let scorePoint = 1; scorePoint <= 5; scorePoint++) {
    const leftScorePoint = document.getElementById(`left-score-card-${scorePoint}`);
    if (leftScorePoint) {
      const colour = leftScorePoint.className.match(/([a-z]+)-([a-z]+)-500/)?.[2];
      if (colour) {
        leftScorePoint.classList.remove(`bg-${colour}-500`);
        leftScorePoint.classList.add('border-2', `border-red-500`);
      }
    }
    const rightScorePoint = document.getElementById(`right-score-card-${scorePoint}`);
    if (rightScorePoint) {
      const colour = rightScorePoint.className.match(/([a-z]+)-([a-z]+)-500/)?.[2];
      if (colour) {
        rightScorePoint.classList.remove(`bg-${colour}-500`);
        rightScorePoint.classList.add('border-2', `border-red-500`);
      }
    }
  }
}

function dispatchNextMatchEvent(stats: gameStats): void {
  const gameEndEvent = new CustomEvent<gameEnd>('game:end', {
    detail: {
      matchStats: stats,
    },
  });

  // Dispatch the event from the global window object.
  window.dispatchEvent(gameEndEvent);
}
