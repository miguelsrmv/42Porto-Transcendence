/**
 * @file navigation.ts
 * @brief Handles navigation and view loading for the application.
 * 
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */

/**
 * @brief Event listener for custom "navigate" events.
 * 
 * Loads the specified view when a "navigate" event is dispatched.
 * 
 * @param e The navigation event containing the view name in its detail.
 */
document.addEventListener("navigate", (e: Event) => {
    const customEvent = e as CustomEvent; // Explicit cast
    const view = customEvent.detail;
    loadView(view);
})

/**
 * @brief Navigates to a specified view.
 * 
 * Dispatches a custom "navigate" event with the specified view as detail.
 * 
 * @param view The name of the view to navigate to.
 */
export function navigateTo(view: string): void {
    document.dispatchEvent(new CustomEvent("navigate", { detail: view }));
    addEventListeners();
}

/**
 * @brief Adds event listeners to the application container.
 * 
 * This function attaches a click event listener to the main application container.
 * It listens for clicks on elements with the class "nav-button" and triggers navigation
 * to the view specified in the element's 'target-page' attribute.
 */
function addEventListeners(): void {
    document.getElementById("app")?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;

        if (target && target.classList.contains("nav-button")) {
            const view = target.getAttribute('target-page');  // Get the 'data-page' attribute
            if (view) {
                navigateTo(view);
            }
        }
    })
}

/**
 * @brief Loads the specified view into the application container.
 * 
 * Retrieves the HTML content of the specified view and inserts it into the
 * main application container. Displays an error message if the view is not found.
 * 
 * @param view The name of the view to load.
 */
function loadView(view: string) {
    const HTMLElement = document.getElementById(view);
    const appElement = document.getElementById("app");
    if (HTMLElement)
        appElement!.innerHTML = HTMLElement.innerHTML;
    else
        appElement!.innerHTML = "<h1>Error! Page not found</h1>";
}

