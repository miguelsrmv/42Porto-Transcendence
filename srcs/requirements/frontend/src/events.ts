/**
 * @file events.ts
 * @brief Handles event listeners for the application.
 * 
 * This file contains functions to set up event listeners, such as handling browser history
 * navigation events to ensure the application navigates to the correct view when the user
 * uses the browser's back and forward buttons.
 */

import { navigateTo } from "./navigation.js"

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

/**
 * @brief Adds a navigation listener to the document.
 * 
 * This function sets up a global click event listener on the document to handle
 * navigation. It intercepts clicks on anchor elements with a `data-target` attribute
 * and navigates to the specified view without reloading the page.
 */
export function addNavigationListener(): void {
    // Sets up global navigation function
    document.addEventListener("click", function(e) {
        const target = e.target as HTMLElement;
        const anchor = target.closest("a[data-target]");

        if (anchor) {
            e.preventDefault();
            const view = anchor.getAttribute("data-target");
            if (view) navigateTo(view);
        }
    });
}

/**
 * @brief Toggles the visibility of a dropdown menu.
 * 
 * This function manages the visibility of a dropdown menu associated with a button.
 * It toggles the dropdown's visibility when the button is clicked and hides the dropdown
 * when clicking outside of it.
 */
export function toggleDropdown(): void {
    const button = document.getElementById("nav-settings-button");
    const dropdown = document.getElementById("settings-dropdown");

    if (!button || !dropdown) return;

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as Node;
        if (!button.contains(target) && !dropdown.contains(target)) {
            dropdown.classList.add("hidden");
        }
    });
}

