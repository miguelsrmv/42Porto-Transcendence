/**
 * @file inputHandler.ts
 * @brief Handles keyboard input for the game, including paddle movement and special attacks.
 */

import { gameState, SPEED } from './game.js';
import { Player } from './player.js';
import type { gameType } from '../gameSettings/gameSettings.types.js';

/**
 * @brief Tracks the state of keys (pressed or not pressed).
 */
const keys: Record<string, boolean> = {};

/**
 * @brief Resets all key states to false.
 */
function resetKeys() {
  for (const key in keys) {
    keys[key] = false;
  }
}

/**
 * @brief Sets up input event listeners for the game.
 *
 * @param leftPlayer The left player object.
 * @param rightPlayer The right player object.
 * @param gameType The type of game being played.
 * @return An object with methods to enable and disable input handling.
 */
export function setupInput(leftPlayer: Player, rightPlayer: Player, gameType: gameType) {
  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === ' ' && gameType === 'Crazy Pong') {
      leftPlayer.attack?.attack();
    } else if (e.key === 'Enter' && gameType === 'Crazy Pong') {
      rightPlayer.attack?.attack();
    } else {
      keys[e.key] = true;
    }
  };
  const keyUpHandler = (e: KeyboardEvent) => {
    keys[e.key] = false;
  };

  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
  return {
    /**
     * @brief Disables input handling by removing event listeners.
     */
    disable: () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    },
    /**
     * @brief Enables input handling by adding event listeners.
     */
    enable: () => {
      window.addEventListener('keydown', keyDownHandler);
      window.addEventListener('keyup', keyUpHandler);
    },
  };
}

/**
 * @brief Updates paddle movement based on key input.
 *
 * @param leftPlayer The left player object.
 * @param rightPlayer The right player object.
 * @param state The current state of the game.
 */
export function handleInput(leftPlayer: Player, rightPlayer: Player, state: gameState): void {
  if (state == gameState.paused) {
    resetKeys();
    return;
  }
  // Left paddle ('w' and 's')
  if (keys['w']) {
    leftPlayer.ownPaddle.speedY = -SPEED * leftPlayer.ownPaddle.speedModifier;
  } else if (keys['s']) {
    leftPlayer.ownPaddle.speedY = SPEED * leftPlayer.ownPaddle.speedModifier;
  } else {
    leftPlayer.ownPaddle.speedY = 0;
  }

  // Right paddle ('ArrowUp' and 'ArrowDown')
  if (keys['ArrowUp']) {
    rightPlayer.ownPaddle.speedY = -SPEED * rightPlayer.ownPaddle.speedModifier;
  } else if (keys['ArrowDown']) {
    rightPlayer.ownPaddle.speedY = SPEED * rightPlayer.ownPaddle.speedModifier;
  } else {
    rightPlayer.ownPaddle.speedY = 0;
  }
}
