/**
 * @file events.ts
 * @brief Handles event listeners for the application.
 *
 * This file contains functions to set up event listeners, such as handling browser history
 * navigation events to ensure the application navigates to the correct view when the user
 * uses the browser's back and forward buttons.
 */
import { navigateTo } from "./navigation.js";
/**
 * @brief Sets up a listener for the popstate event.
 *
 * This function adds an event listener to the window object to handle the popstate event.
 * When the user navigates through the browser history, this listener ensures that the
 * application navigates to the correct view stored in the history state.
 */
export function setupHistoryListener() {
    window.addEventListener("popstate", (event) => {
        const state = event.state;
        if (state === null || state === void 0 ? void 0 : state.view) {
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
export function addNavigationListener() {
    // Sets up global navigation function
    document.addEventListener("click", function (e) {
        const target = e.target;
        const anchor = target.closest("a[data-target]");
        if (anchor) {
            e.preventDefault();
            const view = anchor.getAttribute("data-target");
            if (view)
                navigateTo(view);
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
export function toggleDropdown() {
    const button = document.getElementById("nav-settings-button");
    const dropdown = document.getElementById("settings-dropdown");
    if (!button || !dropdown)
        return;
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!button.contains(target) && !dropdown.contains(target)) {
            dropdown.classList.add("hidden");
        }
    });
}
export function createCharacterLoop(player_number = 1) {
    const characters = [
        'mario.png',
        'yoshi.png',
        'donkey_kong.png',
        'pikachu.png',
        'mewtwo.png',
        'link.png',
        'sonic.png',
        'samus.png'
    ];
    const location = "./static/character_select/";
    let currentCharacterIndex = 0;
    const prevButton = document.getElementById(`prev-character-${player_number}`);
    const nextButton = document.getElementById(`next-character-${player_number}`);
    const characterDisplay = document.getElementById(`character-img-${player_number}`);
    function updateCharacterDisplay() {
        if (characterDisplay)
            characterDisplay.src = location + characters[currentCharacterIndex];
    }
    // Event listener for previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Decrement the index and cycle back to the end if necessary
            currentCharacterIndex = (currentCharacterIndex === 0) ? characters.length - 1 : currentCharacterIndex - 1;
            updateCharacterDisplay();
        });
    }
    // Event listener for next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Increment the index and cycle back to the start if necessary
            currentCharacterIndex = (currentCharacterIndex === characters.length - 1) ? 0 : currentCharacterIndex + 1;
            updateCharacterDisplay();
        });
    }
    // Initialize the first character
    updateCharacterDisplay();
}
export function createBackgroundLoop() {
    const backgrounds = [
        'Backyard.png',
        'Beach.png',
        'Cave.png',
        'Checks.png',
        'City.png',
        'Desert.png',
        'Forest.png',
        'Machine.png',
        'Nostalgic.png',
        'Pikapika_Platinum.png',
        'River.png',
        'Savanna.png',
        'Seafloor.png',
        'Simple.png',
        'Sky.png',
        'Snow.png',
        'Space.png',
        'Torchic.png',
        'Volcano.png'
    ];
    const location = "./static/backgrounds/";
    let currentBackgroundIndex = 0;
    const prevButton = document.getElementById('prev-background');
    const nextButton = document.getElementById('next-background');
    const backgroundDisplay = document.getElementById('background-img');
    function updateBackgroundDisplay() {
        if (backgroundDisplay)
            backgroundDisplay.style.backgroundImage = `url('${location}${backgrounds[currentBackgroundIndex]}`;
    }
    // Event listener for previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Decrement the index and cycle back to the end if necessary
            currentBackgroundIndex = (currentBackgroundIndex === 0) ? backgrounds.length - 1 : currentBackgroundIndex - 1;
            updateBackgroundDisplay();
        });
    }
    // Event listener for next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Increment the index and cycle back to the start if necessary
            currentBackgroundIndex = (currentBackgroundIndex === backgrounds.length - 1) ? 0 : currentBackgroundIndex + 1;
            updateBackgroundDisplay();
        });
    }
    // Initialize the first character
    updateBackgroundDisplay();
}
//# sourceMappingURL=events.js.map