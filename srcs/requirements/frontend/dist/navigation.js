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
import { addLandingAnimations } from "./landing.js";
import { addNavEvents } from "./events.js";
/**
 * @brief Navigates to a specified view.
 *
 * This function updates the main application container with the content of the specified view's template.
 * It also updates the browser history and sets up event listeners for the new view.
 *
 * @param view The ID of the view to navigate to.
 * @param replace A boolean indicating whether to replace the current history state or push a new one.
 */
export function navigateTo(view, update_history = true) {
    // If I'm already at a given view, do nothing
    if (view === currentView)
        return;
    // Updates previousView and currentView variable
    previousView = currentView;
    currentView = view;
    // Gets contents of each view
    const bodyContents = getBodyContents(view);
    // Adjust header and navigation
    adjustHeaderAndNav(view);
    // Renders view content
    renderView(bodyContents);
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
export function getPreviousView() {
    return previousView;
}
/**
 * @brief Creates the structure for each view
 *
 * This function returns an object which describes the structure of each view
 * The body contents will eventually be replaced by each part of the returned object
 *
 * @param view The ID of the view to navigate to.
 */
function getBodyContents(view) {
    const bodyContents = {
        header: null,
        main: null,
        nav: null,
    };
    // Loads main view
    const mainContent = document.getElementById(view);
    bodyContents.main = mainContent.content.cloneNode(true);
    if (view !== "landing-template") {
        // Loads header if not in landing-template
        const headerContent = document.getElementById(view.replace("template", "header"));
        bodyContents.header = headerContent.content.cloneNode(true);
        // Loads nav-bar if not in landing-template
        const navContent = document.getElementById("nav-bar");
        bodyContents.nav = navContent.content.cloneNode(true);
        if (view === "main-menu-template") {
            // Erases back-button if on main-menu
            const backButton = bodyContents.nav.querySelector("#nav-back-button");
            if (backButton) {
                backButton.remove();
            }
        }
        else if (view === "guest-menu-template") {
            // Erases settings-button if on guest menu
            const settingsButton = bodyContents.nav.querySelector("#nav-settings-button");
            if (settingsButton) {
                settingsButton.remove();
            }
        }
    }
    return bodyContents;
}
function adjustHeaderAndNav(view) {
    const header = document.getElementById("header");
    const main = document.getElementById("app");
    const nav = document.getElementById("navigation");
    if (view != "landing-template") {
        header === null || header === void 0 ? void 0 : header.classList.remove("h-[0%]");
        main === null || main === void 0 ? void 0 : main.classList.remove("h-full");
        nav === null || nav === void 0 ? void 0 : nav.classList.remove("h-[0%]");
        header === null || header === void 0 ? void 0 : header.classList.add("h-[15%]");
        main === null || main === void 0 ? void 0 : main.classList.add("h-[70vh]");
        nav === null || nav === void 0 ? void 0 : nav.classList.add("h-[15%]");
    }
    else {
        header === null || header === void 0 ? void 0 : header.classList.remove("h-[15%]");
        main === null || main === void 0 ? void 0 : main.classList.remove("h-[70vh]");
        nav === null || nav === void 0 ? void 0 : nav.classList.remove("h-[15%]");
        header === null || header === void 0 ? void 0 : header.classList.add("h-[0%]");
        main === null || main === void 0 ? void 0 : main.classList.add("h-full");
        nav === null || nav === void 0 ? void 0 : nav.classList.add("h-[0%]");
    }
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
function renderView(bodyContents) {
    const { header, main, nav } = bodyContents;
    const headerHost = document.getElementById("header");
    const mainHost = document.getElementById("app");
    const navHost = document.getElementById("navigation");
    if (headerHost && header) {
        headerHost.replaceChildren(header);
    }
    if (mainHost && main) {
        mainHost.replaceChildren(main);
    }
    if (navHost && nav) {
        navHost.replaceChildren(nav);
        addNavEvents();
    }
}
/**
 * @brief Adds event listeners for a specified view.
 *
 * This function sets up event listeners specific to the view being loaded.
 *
 * @param view The ID of the view for which to add events.
 */
function addPageEvents(view) {
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
function addAnimations(view) {
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
function addLandingEvents() {
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
function addMainMenuEvents() {
}
/**
* @brief Adds event listeners for the local view.
*
* This function is a placeholder for setting up events specific to the local view.
*/
function addLocalPlayEvents() {
}
/**
 * @brief Adds event listeners for the multiplayer view.
 *
 * This function is a placeholder for setting up events specific to the multiplayer view.
 */
function addRemotePlayEvents() {
}
/**
 * @brief Adds event listeners for the tournament view.
 *
 * This function is a placeholder for setting up events specific to the tournament view.
 */
function addTournamentPlayEvents() {
}
/**
* @brief Adds event listeners for the rankings view.
*
* This function is a placeholder for setting up events specific to the rankings view.
*/
function addRankingEvents() {
}
/**
* @brief Adds event listeners for the rankings view.
*
* This function is a placeholder for setting up events specific to the rankings view.
*/
function addFriendsEvents() {
}
//# sourceMappingURL=navigation.js.map