/**
 * @file mainMenu.ts
 * @brief Handles the setup of the main menu page.
 */

import { showMenuHelperText } from "../../ui/helperText.js"
import { getToken } from "../auth/token.js"

/**
* @brief Initializes view for main menu
* 
* This function sets up the main menu, depending on if the user has logged in or not
*/
export function initializeView() {
	console.log("Here's the token! ", getToken());
	if (getToken())
		document.querySelectorAll('#main-menu-buttons a[data-target]').forEach(function(anchor) {
			showMenuHelperText(anchor);
		});
	else {
		const availableButton = document.getElementById("local-play-button");
		if (availableButton)
			showMenuHelperText(availableButton);

		const disableButton = (buttonId: string, bannerId: string, overlayId: string) => {
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
			if (button) button.classList.add("disabled-button");
		};

		disableButton("remote-play-button", "banner-remote-play", "overlay-remote-play");
		disableButton("tournament-play-button", "banner-tournament-play", "overlay-tournament-play");
		disableButton("rankings-button", "banner-rankings", "overlay-rankings");
		disableButton("friends-button", "banner-friends", "overlay-friends");
	}
}
