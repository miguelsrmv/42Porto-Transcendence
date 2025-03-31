/**
 * @file navigation.ts
 * @brief Handles navigation and view loading for the application.
 * 
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */

let currentView = "";

interface BodyContents {
    header: HTMLTemplateElement | null;
    main: HTMLTemplateElement | null;
    nav: HTMLTemplateElement | null;
}

import { addLandingAnimations } from "./landing.js"

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

    // Updates currentView variable
    currentView = view;

    // Gets contents of each view
    const bodyContents = getBodyContents(view);

    // Renders view content
    renderView(bodyContents);

    // Update browser history
    const state = { view };
    if (update_history) {
        history.pushState(state, "", `#${view}`);
    }

    // Update events on page
    addEvents(view);

    // Trigger animations
    addAnimations(view);
}

/**
 * @brief Creates the structure for each view
 * 
 * This function returns an object which describes the structure of each view
 * The body contents will eventually be replaced by each part of the returned object
 * 
 * @param view The ID of the view to navigate to.
 */
function getBodyContents(view: string): BodyContents {
    const bodyContents: BodyContents = {
        header: null,
        main: null,
        nav: null,
    };

    if (view === "landing-template")
        bodyContents.main = document.getElementById("landing-template") as HTMLTemplateElement;
    else if (view === "main-menu-template") {
        bodyContents.header = document.getElementById("main-menu-header") as HTMLTemplateElement;
        bodyContents.main = document.getElementById("main-menu-template") as HTMLTemplateElement;
        bodyContents.nav = document.getElementById("nav-bar-no-back-button") as HTMLTemplateElement;
    }

    return bodyContents;
}

/**
 * @brief Updates the content of a host element with a template.
 * 
 * This function clears the current content of the host element and replaces it with the content
 * of the specified template element.
 * 
 * @param hostElement The element to update.
 * @param templateElement The template element whose content will be used to update the host element.
 */
function renderView(bodyContents: BodyContents) {
    const { header, main, nav } = bodyContents;
    const headerHost = document.getElementById("header");
    const mainHost = document.getElementById("app");
    const navHost = document.getElementById("navigation");

    if (headerHost && header) {
        const headerClone = document.importNode(header.content, true);
        headerHost.replaceChildren(headerClone);
    }

    if (mainHost && main) {
        const mainClone = document.importNode(main.content, true);
        mainHost.replaceChildren(mainClone);
    }

    if (navHost && nav) {
        const navClone = document.importNode(nav.content, true);
        navHost.replaceChildren(navClone);
    }
}

/**
 * @brief Adds event listeners for a specified view.
 * 
 * This function sets up event listeners specific to the view being loaded.
 * 
 * @param view The ID of the view for which to add events.
 */
function addEvents(view: string): void {
    switch (view) {
        case ("landing-template"):
            addLandingEvents();
            break;
        case ("main-menu-template"):
            addMainMenuEvents();
            break;
        case ("local-template"):
            addLocalPlayEvents();
            break;
        case ("remote-template"):
            addRemotePlayEvents();
            break;
        case ("tournament-template"):
            addTournamentPlayEvents();
            break;
        case ("friends-template"):
            addFriendsEvents();
            break;
        case ("rankings-template"):
            addRankingEvents();
            break;
    }
}

/**
 * @brief Adds animations for a specified view.
 * 
 * This function sets up animations. 
 */
function addAnimations(view: string): void {
    switch (view) {
        case ("landing-template"):
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
    const guestButton = document.getElementById("guest-button");
    const loginButton = document.getElementById("login-button");

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
    if (guestButton)
        guestButton.addEventListener("click", () => navigateTo("main-menu-template"));

    if (loginButton)
        loginButton.addEventListener("click", () => navigateTo("main-menu-template"));
}

/**
* @brief Adds event listeners for the home view.
* 
* This function sets up the navigation bar for the home view.
*/
function addMainMenuEvents(): void {
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
