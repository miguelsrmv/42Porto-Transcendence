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


import { addLandingAnimations, addMenuHelperText } from "./animations.js"
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

    // Adds navigation events
    addNavEvents();

    // Update events on page
    addPageEvents(view);

    // Trigger animations
    addAnimations(view);
}

export function getPreviousView(): string {
    return previousView;
}

function adjustHeaderSize(view: string) {
    const header = document.getElementById("header");
    if (!header) return;

    const isLanding = view === "landing-page";

    header.classList.toggle("h-[0%]", isLanding);
    header.classList.toggle("h-[20%]", !isLanding);
    header.innerText = isLanding ? "" : header.innerText;
}

/**
 * @brief Creates the structure for each view
 * 
 * This function returns an object which describes the structure of each view
 * The body contents will eventually be replaced by each part of the returned object
 * 
 * @param view The ID of the view to navigate to.
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

function addNavEvents(): void {
    document.addEventListener("click", function(e) {
        const target = e.target as HTMLElement;
        if (target.matches("a[data-target]")) {
            e.preventDefault(); // prevents default <a> behavior
            const view = target.getAttribute("data-target");
            if (view) navigateTo(view);
        }
    })
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
function addMainMenuEvents(): void {

    const localPlayMenu = document.getElementById("local-play-button");
    if (localPlayMenu) {
        addMenuHelperText(localPlayMenu, "Play locally with friends!");
        localPlayMenu.addEventListener("click", () => { navigateTo("local-play-page") });
    }

    const remotePlayMenu = document.getElementById("remote-play-button");
    if (remotePlayMenu) {
        addMenuHelperText(remotePlayMenu, "Play online on the ladder!");
        remotePlayMenu.addEventListener("click", () => { navigateTo("remote-play-page") });
    }

    const tourneyMenu = document.getElementById("tournament-play-button");
    if (tourneyMenu) {
        addMenuHelperText(tourneyMenu, "Face other players in a tournament!");
        tourneyMenu.addEventListener("click", () => { navigateTo("tournament-play-page") });
    }

    const friendsMenu = document.getElementById("rankings-button");
    if (friendsMenu) {
        friendsMenu.addEventListener("click", () => { navigateTo("rankings-page") });
        addMenuHelperText(friendsMenu, "Check your stats!")
    }

    const rankingsMenu = document.getElementById("friends-button");
    if (rankingsMenu) {
        rankingsMenu.addEventListener("click", () => { navigateTo("friends-page") });
        addMenuHelperText(rankingsMenu, "See who's online!");
    }

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
