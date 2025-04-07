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
import { addLandingAnimations, addMenuHelperText } from "./animations.js";
import { toggleDropdown } from "./events.js";
import { removeHeightClasses } from "./helpers.js";
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
    adjustHeader(view);
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
    };
    // Loads main view
    let mainContent;
    // If view is not a game view, load it
    if (view !== "local-play-page" && view !== "remote-play-page" && view != "tournament-page")
        mainContent = document.getElementById(view.replace("-page", "-template"));
    // If view is a game view, load game view and customize it depending on game type
    else
        mainContent = getGameMenu(view);
    if (mainContent)
        bodyContents.main = mainContent.content.cloneNode(true);
    // Add Header if not on landing page
    if (view !== "landing-page") {
        // Loads header if not in landing-page
        const headerContent = document.getElementById("header-template");
        bodyContents.header = headerContent.content.cloneNode(true);
        const headerText = bodyContents.header.querySelector("#header-menu-text");
        if (headerText) {
            headerText.innerHTML = view.replace("-page", "").split("-").map(view => view.charAt(0).toUpperCase() + view.slice(1)).join(" ");
        }
    }
    return bodyContents;
}
function getGameMenu(view) {
    const resultTemplate = document.createElement("template");
    const gameMenuTemplate = document.getElementById("game-menu-template");
    const gameMenuContent = gameMenuTemplate.content.cloneNode(true);
    const playerSettings = gameMenuContent.querySelector("#player-settings");
    const playerSettingsTemplate = document.getElementById("player-settings-template");
    const playerSettingsContent = playerSettingsTemplate.content.cloneNode(true);
    playerSettings.replaceChildren(playerSettingsContent);
    resultTemplate.content.appendChild(gameMenuContent);
    return resultTemplate;
}
function adjustHeader(view) {
    const header = document.getElementById("header");
    const main = document.getElementById("app");
    if (header && main) {
        removeHeightClasses(header);
        removeHeightClasses(main);
        if (view === "landing-page") {
            header.classList.add("h-[0%]");
            header.innerText = "";
            main.classList.add("h-full");
        }
        else {
            header.classList.add("h-[10%]");
            main.classList.add("h-[90%]");
        }
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
    const { header, main } = bodyContents;
    const headerHost = document.getElementById("header");
    const mainHost = document.getElementById("app");
    if (headerHost && header) {
        headerHost.replaceChildren(header);
        toggleDropdown();
    }
    if (mainHost && main) {
        mainHost.replaceChildren(main);
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
        case ("tournament-page"):
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
 */
function addAnimations(view) {
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
        guestButton.addEventListener("click", () => navigateTo("main-menu-page"));
    if (loginButton)
        loginButton.addEventListener("click", () => navigateTo("main-menu-page"));
}
/**
* @brief Adds event listeners for the home view.
*
* This function sets up the navigation bar for the home view.
*/
function addMainMenuEvents() {
    const localPlayMenu = document.getElementById("local-play-button");
    if (localPlayMenu) {
        addMenuHelperText(localPlayMenu, "Play locally with friends!");
        localPlayMenu.addEventListener("click", () => { navigateTo("local-play-page"); });
    }
    const remotePlayMenu = document.getElementById("remote-play-button");
    if (remotePlayMenu) {
        addMenuHelperText(remotePlayMenu, "Play online on the ladder!");
        remotePlayMenu.addEventListener("click", () => { navigateTo("remote-play-page"); });
    }
    const tourneyMenu = document.getElementById("tournament-play-button");
    if (tourneyMenu) {
        addMenuHelperText(tourneyMenu, "Face other players in a tournament!");
        tourneyMenu.addEventListener("click", () => { navigateTo("tournament-page"); });
    }
    const friendsMenu = document.getElementById("rankings-button");
    if (friendsMenu) {
        friendsMenu.addEventListener("click", () => { navigateTo("rankings-page"); });
        addMenuHelperText(friendsMenu, "Check your stats!");
    }
    const rankingsMenu = document.getElementById("friends-button");
    if (rankingsMenu) {
        rankingsMenu.addEventListener("click", () => { navigateTo("friends-page"); });
        addMenuHelperText(rankingsMenu, "See who's online!");
    }
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