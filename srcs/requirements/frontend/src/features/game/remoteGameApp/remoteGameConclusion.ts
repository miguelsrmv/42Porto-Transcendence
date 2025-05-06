import type { gameStats } from './remoteGameTypes.js';
import { fadeOut } from '../../../ui/animations.js';

export function showGameStats(winningPlayer: string, playerSide: string, stats: gameStats) {
  const playerHUD = document.getElementById(`${playerSide}-hud`);
  if (!playerHUD) {
    console.warn('No player HUD');
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
  showStatsMenu(winningPlayer, playerSide, stats, playerHUDcopy, colour);
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

function showStatsMenu(
  winningPlayer: string,
  playerSide: string,
  stats: gameStats,
  playerHUDCopy: Node,
  node: string,
) {}

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

  const regExp = /bg-(\w+)-(\d+)/;
  return classList.find((className) => regExp.test(className))?.match(regExp)?.[1];
}
