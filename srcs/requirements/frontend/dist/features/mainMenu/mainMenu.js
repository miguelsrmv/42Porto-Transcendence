/**
 * @file mainMenu.ts
 * @brief Handles the setup of the main menu page.
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
import { showMenuHelperText } from "../../ui/helperText.js";
import { userIsLoggedIn } from "../auth/auth.service.js";
/**
* @brief Initializes view for main menu
*
* This function sets up the main menu, depending on if the user has logged in or not
*/
export function initializeView() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield userIsLoggedIn())
            document.querySelectorAll('#main-menu-buttons a[data-target]').forEach(function (anchor) {
                showMenuHelperText(anchor);
            });
        else {
            const availableButton = document.getElementById("local-play-button");
            if (availableButton)
                showMenuHelperText(availableButton);
            const disableButton = (buttonId, bannerId, overlayId) => {
                const button = document.getElementById(buttonId);
                const banner = document.getElementById(bannerId);
                const overlay = document.getElementById(overlayId);
                if (button) {
                    button.classList.remove("hover:scale-105", "transition", "duration-200");
                    button.removeAttribute("href");
                    button.removeAttribute("data-target");
                }
                if (banner) {
                    banner.classList.remove("bg-red-700");
                    banner.classList.add("bg-gray-700");
                }
                if (overlay) {
                    overlay.classList.remove("bg-red-700", "group-hover:opacity-0", "transition-opacity", "duration-200");
                    overlay.classList.add("bg-gray-700");
                }
                if (button)
                    button.classList.add("disabled-button");
            };
            disableButton("remote-play-button", "banner-remote-play", "overlay-remote-play");
            disableButton("tournament-play-button", "banner-tournament-play", "overlay-tournament-play");
            disableButton("rankings-button", "banner-rankings", "overlay-rankings");
            disableButton("friends-button", "banner-friends", "overlay-friends");
        }
    });
}
//# sourceMappingURL=mainMenu.js.map