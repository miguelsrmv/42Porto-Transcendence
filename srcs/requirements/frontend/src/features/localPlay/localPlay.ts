import { getGameType, createBackgroundLoop, createCharacterLoop } from "../game/gameSetup.js"

/**
* @brief Initializes view for local play
* 
* This function sets up the pre-game page for local play
*/
export async function initializeView(): Promise<void> {
	// Gets Classic or Crazy Pong
	const gameType = await getGameType();

	// Closes model, shows up remaining website
	const gameTypeModal = document.getElementById("game-type-modal");
	const gameSettingsMenu = document.getElementById("game-settings-menu");
	if (gameTypeModal && gameSettingsMenu) {
		gameTypeModal.classList.toggle("hidden");
		gameSettingsMenu.classList.toggle("hidden");
	}

	// Toggles player-2-settings on
	const player2section = document.getElementById("player-2-settings");
	if (player2section)
		player2section.classList.toggle("hidden");

	// Creates background loop
	createBackgroundLoop();

	// If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
	if (gameType === "crazy") {

		const player1name = document.getElementById("player-1-name");
		const player1paddle = document.getElementById("player-1-paddle-colour")
		const player1char = document.getElementById("player-1-character");
		if (player1name && player1paddle && player1char) {
			player1name.classList.remove("h-[15%]");
			player1name.classList.add("h-[50%]");
			player1paddle.classList.remove("h-[15%]");
			player1paddle.classList.add("h-[50%]");
			player1char.classList.toggle("hidden");
		}

		const player2name = document.getElementById("player-2-name");
		const player2paddle = document.getElementById("player-2-paddle-colour")
		const player2char = document.getElementById("player-2-character");
		if (player2name && player2paddle && player2char) {
			player2name.classList.remove("h-[15%]");
			player2name.classList.add("h-[50%]");
			player2paddle.classList.remove("h-[15%]");
			player2paddle.classList.add("h-[50%]");
			player2char.classList.toggle("hidden");
		}

		// Creates character loop (for both players, if needed)
		createCharacterLoop();
		createCharacterLoop(2);
	}
}
