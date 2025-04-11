/**
 * @file app.ts
 * @brief Loads other scripts and sets up scripts
 * 
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */

import { initializeRouter } from './core/router.js'

export let loginStatus = "";
// #TODO: Remove loginStatus and replace it by JWT token
// #TODO: Refactor the navigation .ts into smaller files

export function setLoginStatus(status: string) {
    loginStatus = status;
}

/**
 * @brief Event listener for DOMContentLoaded.
 * 
 * Initializes routing when the DOM content is fully loaded and parsed.
 */
document.addEventListener("DOMContentLoaded", () => {
    initializeRouter();
});
