/**
 * @file app.ts
 * @brief Loads other scripts and sets up scripts
 *
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */
import { navigateTo } from "./navigation.js";
import { setupHistoryListener } from "./events.js";
/**
 * @brief Event listener for DOMContentLoaded.
 *
 * Triggers the loading of the default page when the DOM content is fully loaded and parsed.
 */
document.addEventListener("DOMContentLoaded", () => {
    const initialView = "login-template";
    // Setup history listener first
    setupHistoryListener();
    // Replace the initial state to ensure correct history behavior
    history.replaceState({ view: initialView }, "", `#${initialView}`);
    // Navigate to the initial view
    navigateTo(initialView);
});
//# sourceMappingURL=app.js.map