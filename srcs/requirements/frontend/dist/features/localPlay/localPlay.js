/**
 * @file localPlay.ts
 * @brief Handles the setup of the local play page.
 */
import { getGameType, createBackgroundLoop, createCharacterLoop } from "../game/gameSetup.js";
/**
* @brief Initializes view for local play
*
* This function sets up the pre-game page for local play
*/
export async function initializeView() {
    // Gets Classic or Crazy Pong
    const gameType = await getGameType();
    // Creates background loop
    createBackgroundLoop();
    // Hides game type menu
    const gameTypeSelection = document.getElementById("game-type-selection");
    if (gameTypeSelection)
        gameTypeSelection.classList.add("hidden");
    else
        console.warn("Game Type Selection not found.");
    // Shows game settings menu
    const gameSettingsMenu = document.getElementById("game-settings-menu");
    if (gameSettingsMenu)
        gameSettingsMenu.classList.remove("hidden");
    else
        console.warn("Game Settings Menu not found.");
    // Toggle second player
    const player2Settings = document.getElementById("player-2-settings");
    if (player2Settings)
        player2Settings.classList.remove("hidden");
    else
        console.warn("Player 2 Settings not found.");
    // If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
    if (gameType === "crazy") {
        // Unhides character selection
        const characterSelect1 = document.getElementById("player-1-character");
        if (characterSelect1)
            characterSelect1.classList.remove("hidden");
        else
            console.warn("Character Select 1 not found.");
        const characterSelect2 = document.getElementById("player-2-character");
        if (characterSelect2)
            characterSelect2.classList.remove("hidden");
        else
            console.warn("Character Select 2 not found.");
        // Creates character loop (for both players)
        createCharacterLoop();
        createCharacterLoop(2);
    }
}
//# sourceMappingURL=localPlay.js.map