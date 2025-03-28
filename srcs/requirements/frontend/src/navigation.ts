/**
 * @file navigation.ts
 * @brief Handles navigation and view loading for the application.
 * 
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */

let currentView = "";

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

    const appElement = document.getElementById("app");
    const templateElement = document.getElementById(view) as HTMLTemplateElement;

    if (templateElement && appElement) {
        // Updates current view
        currentView = view;

        // Renders view content
        renderView(appElement, templateElement);

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
function renderView(hostElement: HTMLElement, templateElement: HTMLTemplateElement) {
    const clone = document.importNode(templateElement.content, true);
    hostElement.replaceChildren(clone);

    const navigationElement = document.getElementById("navigation");
    if (currentView === "landing-template" && navigationElement) {
        navigationElement.innerText = "";
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
        case ("home-template"):
            addHomeEvents();
            break;
        case ("local-template"):
            addLocalEvents();
            break;
        case ("multiplayer-template"):
            addMultiplayerEvents();
            break;
        case ("tournament-template"):
            addTournamentEvents();
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
    document.getElementById("enter-button")!.addEventListener("click", () => {
        navigateTo("home-template")
    });
}

/**
* @brief Adds event listeners for the home view.
* 
* This function sets up the navigation bar for the home view.
*/
// TODO: Change "addNavBar" for when login is done??
function addHomeEvents(): void {
    addNavBar();
}

/**
* @brief Adds event listeners for the local view.
* 
* This function is a placeholder for setting up events specific to the local view.
*/
function addLocalEvents(): void {
}

/**
 * @brief Adds event listeners for the multiplayer view.
 * 
 * This function is a placeholder for setting up events specific to the multiplayer view.
 */
function addMultiplayerEvents(): void {
}

/**
 * @brief Adds event listeners for the tournament view.
 * 
 * This function is a placeholder for setting up events specific to the tournament view.
 */
function addTournamentEvents(): void {
}

/**
* @brief Adds event listeners for the rankings view.
* 
* This function is a placeholder for setting up events specific to the rankings view.
*/
function addRankingEvents(): void {
}

/**
 * @brief Adds the navigation bar to the application.
 * 
 * This function updates the navigation bar with its template content and sets up event listeners
 * for navigation buttons within the bar.
 */
function addNavBar(): void {
    const navBar = document.getElementById("navigation");
    const navBarTemplate = document.getElementById("nav-bar") as HTMLTemplateElement;

    if (navBar && navBarTemplate) {
        // Shows navigation bar elements
        renderNavBar(navBar, navBarTemplate);

        // Sets up event litener for navigation bar (event delegation)
        addNavBarListener();
    }
}
/**
 * @brief Renders the navigation bar content.
 * 
 * This function replaces the current content of the navigation bar location with the content
 * of the specified navigation bar template.
 * 
 * @param navBarLocation The element where the navigation bar will be rendered.
 * @param navBar The template element containing the navigation bar content.
 */
function renderNavBar(navBarLocation: HTMLElement, navBar: HTMLTemplateElement): void {
    const clone = document.importNode(navBar.content, true);
    navBarLocation.replaceChildren(clone);
}

/**
 * @brief Sets up event listeners for the navigation bar.
 * 
 * This function adds a click event listener to the navigation bar to handle navigation button clicks.
 * It uses event delegation to determine which button was clicked and navigates to the corresponding view.
 */
function addNavBarListener(): void {
    document.getElementById("navigation")?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("nav-button")) {
            const target_view = target.getAttribute("data-target");
            if (target_view) {
                event.preventDefault();
                navigateTo(target_view);
            }
        }
    });
}
