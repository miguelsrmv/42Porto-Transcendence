/**
 * @file navigation.ts
 * @brief Handles navigation and view loading for the application.
 * 
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */

/**
 * @brief Navigates to a specified view.
 * 
 * This function updates the main application container with the content of the specified view's template.
 * It also updates the browser history and sets up event listeners for the new view.
 * 
 * @param view The ID of the view to navigate to.
 * @param replace A boolean indicating whether to replace the current history state or push a new one.
 */

export function navigateTo(view: string, replace: boolean = false): void {
    const appElement = document.getElementById("app");
    const templateElement = document.getElementById(view) as HTMLTemplateElement;

    if (templateElement && appElement) {
        // Update app content
        updateView(appElement, templateElement);

        // Update browser history
        const state = { view };
        if (replace) {
            history.replaceState(state, "", `#${view}`);
        } else {
            history.pushState(state, "", `#${view}`);
        }

        // Update Events on page
        addEvents(view);
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
function updateView(hostElement: HTMLElement, templateElement: HTMLTemplateElement) {
    const clone = document.importNode(templateElement.content, true);
    hostElement.replaceChildren(clone);

    const navigationElement = document.getElementById("navigation");
    if (navigationElement && templateElement.id === "login-template") {
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
        case ("login-template"):
            addLoginEvents();
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
 * @brief Adds event listeners for the login view.
 * 
 * This function sets up the event listener for the login button, which navigates to the home view upon click.
 */
function addLoginEvents(): void {
    document.getElementById("login-button")!.addEventListener("click", () => {
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
        updateView(navBar, navBarTemplate);

        // Updates navigation bar to allow for navigation
        const navButtons = document.querySelectorAll(".nav-button");
        navButtons.forEach(button => {
            const target_view = button.getAttribute("target-nav");
            if (target_view) {
                const oldButton = button.cloneNode(true);
                button.parentNode?.replaceChild(oldButton, button);

                oldButton.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent default link behavior
                    const replace_history = document.getElementById("app")?.innerHTML === document.getElementById(target_view)?.innerHTML;
                    navigateTo(target_view, replace_history);
                });
            }
        });
    }
}
