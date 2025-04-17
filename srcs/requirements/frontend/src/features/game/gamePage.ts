import { initializeGame } from "./gameApp/game.js"
import { getGameSettings } from "./gameSetup.js"

/**
 * @file gamePage.ts
 * @brief Initializes the game page view.
 * 
 * This module is responsible for setting up the game page by initializing the game
 * and preparing any necessary event listeners or UI components.
 */

/**
 * @brief Initializes the view for the game page.
 * 
 * This function calls the `initializeGame` function to set up the game environment.
 * It is responsible for preparing the game page for user interaction.
 */
export function initializeView(): void {
	const gameSettings = getGameSettings();
	console.log(gameSettings);
	initializeGame();
}


