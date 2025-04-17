/**
 * @file remotePlay.ts
 * @brief Handles the setup of the remote play page.
 */
import { getGameType, createBackgroundLoop, createCharacterLoop } from "../game/gameSetup.js";
/**
* @brief Initializes view for remote play
*
* This function sets up the pre-game page for remote play
*/
export async function initializeView() {
    // Gets Classic or Crazy Pong
    const gameType = await getGameType();
    // Closes model, shows up remaining website
    const gameTypeModal = document.getElementById("game-type-modal");
    const gameSettingsMenu = document.getElementById("game-settings-menu");
    if (gameTypeModal && gameSettingsMenu) {
        gameTypeModal.classList.toggle("hidden");
        gameSettingsMenu.classList.toggle("hidden");
    }
    // Creates background loop
    createBackgroundLoop();
    // If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
    if (gameType === "crazy") {
        const player1name = document.getElementById("player-1-name");
        const player1paddle = document.getElementById("player-1-paddle-colour");
        const player1char = document.getElementById("player-1-character");
        if (player1name && player1paddle && player1char) {
            player1name.classList.remove("h-[15%]");
            player1name.classList.add("h-[50%]");
            player1paddle.classList.remove("h-[15%]");
            player1paddle.classList.add("h-[50%]");
            player1char.classList.toggle("hidden");
        }
    }
    // Creates character loop 
    createCharacterLoop();
}
//# sourceMappingURL=remotePlay.js.map