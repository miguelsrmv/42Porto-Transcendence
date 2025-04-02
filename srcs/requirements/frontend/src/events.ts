/**
 * @file events.ts
 * @brief Handles event listeners for the application.
 * 
 * This file contains functions to set up event listeners, such as handling browser history
 * navigation events to ensure the application navigates to the correct view when the user
 * uses the browser's back and forward buttons.
 */

import { navigateTo, getPreviousView } from "./navigation.js"

/**
 * @brief Sets up a listener for the popstate event.
 * 
 * This function adds an event listener to the window object to handle the popstate event.
 * When the user navigates through the browser history, this listener ensures that the
 * application navigates to the correct view stored in the history state.
 */

export function setupHistoryListener(): void {
    window.addEventListener("popstate", (event) => {
        const state = event.state;

        if (state?.view) {
            // Navigate to the view stored in the state
            navigateTo(state.view, false);
        }
    });
}

export function addNavEvents(): void {
    addSettingsMenu();
    addBackArrow();
}

function addSettingsMenu(): void {
    const settingsButton = document.getElementById("nav-settings-button");
    const settingsMenu = document.getElementById("settings-dropdown");

    settingsButton?.addEventListener("click", () => {
        settingsMenu?.classList.toggle("opacity-0");
        settingsMenu?.classList.toggle("pointer-events-none");
    });
}

function addBackArrow(): void {
    const backButton = document.getElementById("nav-back-button");

    backButton?.addEventListener("click", () => {
        navigateTo(getPreviousView(), false);
    })
}
