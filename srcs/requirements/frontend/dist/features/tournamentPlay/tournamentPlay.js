/**
 * @file tournamentPlay.ts
 * @brief Handles the setup of the tournamnet play page.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getGameType, createBackgroundLoop, createCharacterLoop } from "../game/gameSetup.js";
/**
* @brief Initializes view for tournament play
*
* This function sets up the view for tournament play
*/
export function initializeView() {
    return __awaiter(this, void 0, void 0, function* () {
        // Gets Classic or Crazy Pong
        const gameType = yield getGameType();
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
    });
}
//# sourceMappingURL=tournamentPlay.js.map