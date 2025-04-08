/**
 * @file navigation.ts
 * @brief Handles navigation and view loading for the application.
 * 
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */

let currentView = "";
let previousView = "";


import { addLandingAnimations, showMenuHelperText } from "./animations.js"
import { toggleDropdown } from "./events.js"

/**
 * @brief Navigates to a specified view.
 * 
 * This function updates the main application container with the content of the specified view's template.
 * It also updates the browser history and sets up event listeners for the new view.
 * 
 * @param view The ID of the view to navigate to.
 * @param replace A boolean indicating whether to replace the current history state or push a new one.
 */
export function navigateTo(view: string, update_history: boolean = true): void {
    // If I'm already at a given view, do nothing
    if (view === currentView)
        return;

    // Updates previousView and currentView variable
    previousView = currentView;
    currentView = view;

    // Adjust header size
    adjustHeaderSize(view);

    // Renders view content
    renderView(view);

    // Update browser history
    const state = { view };
    if (update_history) {
        history.pushState(state, "", `#${view}`);
    }

    // Update events on page
    addPageEvents(view);

    // Trigger animations
    addAnimations(view);
}

/**
 * @brief Adjusts the header size based on the current view.
 * 
 * This function modifies the header's height and content depending on whether the current view
 * is the landing page or another view.
 * 
 * @param view The ID of the current view.
 */
function adjustHeaderSize(view: string) {
    const header = document.getElementById("header");
    if (!header) return;

    const isLanding = view === "landing-page";

    header.classList.toggle("h-[0%]", isLanding);
    header.classList.toggle("h-[20%]", !isLanding);
    header.innerText = isLanding ? "" : header.innerText;
}


/**
 * @brief Renders the specified view's content.
 * 
 * This function loads the main and header templates for the specified view into the application.
 * It also sets up the dropdown and updates the header text for non-landing pages.
 * 
 * @param view The ID of the view to render.
 */
function renderView(view: string): void {
    // Loads main view
    const mainHost = document.getElementById("app");
    const mainTemplate = document.getElementById(view.replace("-page", "-template")) as HTMLTemplateElement;

    if (mainHost && mainTemplate)
        mainHost.replaceChildren(mainTemplate.content.cloneNode(true));

    // Loads header view
    const headerHost = document.getElementById("header");
    const headerContent = document.getElementById("header-template") as HTMLTemplateElement;
    if (headerHost && headerContent && view !== "landing-page") {
        // Loads header if not in landing-page
        headerHost.replaceChildren(headerContent.content.cloneNode(true));
        // Toggles dropdown
        toggleDropdown();
        // Updates headerText
        const headerText = headerHost.querySelector("#header-menu-text");
        if (headerText) {
            headerText.innerHTML = view.replace("-page", "").split("-").map(view => view.charAt(0).toUpperCase() + view.slice(1)).join(" ");
        }
    }
}

/**
 * @brief Adds event listeners for a specified view.
 * 
 * This function sets up event listeners specific to the view being loaded.
 * 
 * @param view The ID of the view for which to add events.
 */
function addPageEvents(view: string): void {
    switch (view) {
        case ("landing-page"):
            addLandingEvents();
            break;
        case ("main-menu-page"):
            addMainMenuEvents();
            break;
        case ("local-play-page"):
            addLocalPlayEvents();
            break;
        case ("remote-play-page"):
            addRemotePlayEvents();
            break;
        case ("tournament-play-page"):
            addTournamentPlayEvents();
            break;
        case ("friends-page"):
            addFriendsEvents();
            break;
        case ("rankings-page"):
            addRankingEvents();
            break;
    }
}

/**
 * @brief Adds animations for a specified view.
 * 
 * This function sets up animations. 
 *
 * @param view the ID of the view for which to add animations.
 */
function addAnimations(view: string): void {
    switch (view) {
        case ("landing-page"):
            addLandingAnimations();
            break;
    }
}

/**
 * @brief Adds event listeners for the landing view.
 * 
 * This function sets up the event listener for the landing button, which navigates to the home view upon click.
 */
function addLandingEvents(): void {
    const modal = document.getElementById("login-modal");
    const enterButton = document.getElementById("enter-button");
    const backButton = document.getElementById("back-button");

    if (modal && enterButton && backButton) {
        enterButton.addEventListener("click", () => {
            modal.style.display = "block";
            // Force reflow to ensure animation plays
            void modal.offsetWidth;
            modal.classList.remove("exiting");
            modal.classList.add("entering");
        });

        backButton.addEventListener("click", () => {
            modal.classList.remove("entering");
            modal.classList.add("exiting");
            setTimeout(() => {
                modal.style.display = "none";
            }, 300);
        });
    }
}

/**
* @brief Adds event listeners for the home view.
* 
* This function sets up the navigation bar for the home view.
*/
function addMainMenuEvents(): void {
    // For each <a> inside #main-menu-buttons, apply Helper Text
    document.querySelectorAll('#main-menu-buttons a[data-target]').forEach(function(anchor) {
        showMenuHelperText(anchor);
    });
}

/**
* @brief Adds event listeners for the local view.
* 
* This function is a placeholder for setting up events specific to the local view.
*/
function addLocalPlayEvents(): void {
}

/**
 * @brief Adds event listeners for the multiplayer view.
 * 
 * This function is a placeholder for setting up events specific to the multiplayer view.
 */
function addRemotePlayEvents(): void {
}

/**
 * @brief Adds event listeners for the tournament view.
 * 
 * This function is a placeholder for setting up events specific to the tournament view.
 */
function addTournamentPlayEvents(): void {
}

/**
* @brief Adds event listeners for the rankings view.
* 
* This function is a placeholder for setting up events specific to the rankings view.
*/
function addRankingEvents(): void {
}

/**
* @brief Adds event listeners for the rankings view.
* 
* This function is a placeholder for setting up events specific to the rankings view.
*/
function addFriendsEvents(): void {
}
