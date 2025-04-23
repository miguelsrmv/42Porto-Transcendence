import type { gameSettings } from '../gameSettings/gameSettings.types.js';

export function initializeRemoteGame(gameSettings: gameSettings) {
  console.log('Hi from remote Game');
  console.log("Here's the game settings:");
  console.log(gameSettings);
}
