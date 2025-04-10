/**
 * @file navigation.ts
 * @brief Handles navigation and view loading for the application.
 *
 * This file contains the logic to handle navigation events and load the appropriate
 * views into the main application container. It listens for the DOMContentLoaded event
 * to load the default view and custom navigation events to switch views.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentView = "";
let previousView = "";
let loginStatus = "";
import { addLandingAnimations, showMenuHelperText } from "./animations.js";
import { toggleDropdown, createCharacterLoop, createBackgroundLoop } from "./events.js";
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
function adjustHeaderSize(view) {
    const header = document.getElementById("header");
    if (!header)
        return;
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
function renderView(view) {
    // Loads main view
    const mainHost = document.getElementById("app");
    let mainTemplate;
    if (view === "local-play-page" || view === "remote-play-page" || view == "tournament-play-page")
        mainTemplate = document.getElementById("game-menu-template");
    else
        mainTemplate = document.getElementById(view.replace("-page", "-template"));
    if (mainHost && mainTemplate)
        mainHost.replaceChildren(mainTemplate.content.cloneNode(true));
    // Loads header view
    const headerHost = document.getElementById("header");
    const headerContent = document.getElementById("header-template");
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
function addPageEvents(view) {
    switch (view) {
        case ("landing-page"):
            addLandingEvents();
            break;
        case ("main-menu-page"):
            addMainMenuEvents();
            break;
        case ("local-play-page"):
        case ("remote-play-page"):
        case ("tournament-play-page"):
            addPlayEvents(view);
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
    if (modal && enterButton) {
        enterButton.addEventListener("click", () => {
            modal.style.display = "block";
            // Force reflow to ensure animation plays
            void modal.offsetWidth;
            modal.classList.remove("exiting");
            modal.classList.add("entering");
        });
    }
    const loginButton = document.getElementById("login-button");
    const guestButton = document.getElementById("guest-button");
    if (loginButton && guestButton) {
        loginButton.addEventListener("click", () => {
            toggleLoginMenu();
            loginStatus = "login";
        }, { once: true });
        guestButton.addEventListener("click", () => {
            loginStatus = "guest";
        }, { once: true });
    }
}
function toggleLoginMenu() {
    var _a;
    const initialLoginButtons = document.getElementById("initial-login-buttons");
    if (initialLoginButtons)
        initialLoginButtons.classList.add("hidden");
    const loginForm = document.getElementById("login-form");
    if (loginForm)
        loginForm.classList.toggle("hidden");
    (_a = document.getElementById("login-form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault(); // Prevent default form submission
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value.toString();
            });
            try {
                const response = yield fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    // Handle non-200 response codes (e.g., 401 Unauthorized)
                    throw new Error(`HTTP error ${response.status}`);
                }
                const result = yield response.json();
                console.log("Login successful:", result);
                // Handle success (e.g., redirect or store token)
            }
            catch (error) {
                console.error("Login failed:", error);
                // Handle errors (e.g., show error message to user)
            }
        });
    });
}
//
// const registerButton = document.getElementById("register-button");
// if (registerButton) {
//     registerButton.addEventListener("click", () => toggleRegisterMenu());
// }
function toggleRegisterMenu() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    if (loginForm && registerForm) {
        loginForm.classList.toggle("hidden");
        registerForm.classList.toggle("hidden");
    }
}
function getGameType() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const classicButton = document.getElementById("classic-pong-button");
            const crazyButton = document.getElementById("crazy-pong-button");
            if (classicButton && crazyButton) {
                classicButton.addEventListener("click", () => {
                    resolve("classic");
                }, { once: true });
                crazyButton.addEventListener("click", () => {
                    resolve("crazy");
                }, { once: true });
            }
        });
    });
}
/**
* @brief Adds event listeners for the home view.
*
* This function sets up the navigation bar for the home view.
*/
function addMainMenuEvents() {
    // For each <a> inside #main-menu-buttons, apply Helper Text
    // NOTE: Faster than event delegation!!
    if (loginStatus === "login")
        document.querySelectorAll('#main-menu-buttons a[data-target]').forEach(function (anchor) {
            showMenuHelperText(anchor);
        });
    else if (loginStatus === "guest") {
        const availableButton = document.getElementById("local-play-button");
        if (availableButton)
            showMenuHelperText(availableButton);
        const disableButton = (buttonId, bannerId, overlayId) => {
            const button = document.getElementById(buttonId);
            const banner = document.getElementById(bannerId);
            const overlay = document.getElementById(overlayId);
            if (button) {
                button.classList.remove("hover:scale-105", "transition", "duration-200");
                button.removeAttribute("href");
                button.removeAttribute("data-target");
            }
            if (banner) {
                banner.classList.remove("bg-red-700");
                banner.classList.add("bg-gray-700");
            }
            if (overlay) {
                overlay.classList.remove("bg-red-700", "group-hover:opacity-0", "transition-opacity", "duration-200");
                overlay.classList.add("bg-gray-700");
            }
            if (button)
                button.classList.add("disabled-button");
        };
        disableButton("remote-play-button", "banner-remote-play", "overlay-remote-play");
        disableButton("tournament-play-button", "banner-tournament-play", "overlay-tournament-play");
        disableButton("rankings-button", "banner-rankings", "overlay-rankings");
        disableButton("friends-button", "banner-friends", "overlay-friends");
    }
}
/**
* @brief Adds event listeners for the local, ranked or tournament view
*
* This function sets up the pre-game page depending on the imported view
*/
function addPlayEvents(view) {
    return __awaiter(this, void 0, void 0, function* () {
        // Gets Classic or Crazy Pong
        const gameType = yield getGameType();
        // Gets number of players
        const playerNumber = view === "local-play-page" ? 2 : 1;
        // Closes model, shows up remaining website
        const gameTypeModal = document.getElementById("game-type-modal");
        const gameSettingsMenu = document.getElementById("game-settings-menu");
        if (gameTypeModal && gameSettingsMenu) {
            gameTypeModal.classList.toggle("hidden");
            gameSettingsMenu.classList.toggle("hidden");
        }
        // If 2 players, toggles player-2-settings on
        const player2section = document.getElementById("player-2-settings");
        if (playerNumber === 2 && player2section)
            player2section.classList.toggle("hidden");
        // Creates background loop
        createBackgroundLoop();
        // If Crazy Pong, toggles character select section, adjusts sizes & activates character loop
        if (gameType === "crazy") {
            const player1name = document.getElementById("player-1-name");
            const player1paddle = document.getElementById("player-1-paddle-colour");
            const player1char = document.getElementById("player-1-character");
            if (player1name && player1paddle && player1char) {
                player1name.classList.remove("h-[15%]");
                player1name.classList.add("h-[50%]");
                player1paddle.classList.remove("h-[15%]");
                player1paddle.classList.add("h-[50%]");
                player1char.classList.toggle("hidden");
            }
            const player2name = document.getElementById("player-2-name");
            const player2paddle = document.getElementById("player-2-paddle-colour");
            const player2char = document.getElementById("player-2-character");
            if (player2name && player2paddle && player2char && playerNumber === 2) {
                player2name.classList.remove("h-[15%]");
                player2name.classList.add("h-[50%]");
                player2paddle.classList.remove("h-[15%]");
                player2paddle.classList.add("h-[50%]");
                player2char.classList.toggle("hidden");
            }
            // Creates character loop (for both players, if needed)
            createCharacterLoop();
            if (playerNumber === 2)
                createCharacterLoop(2);
        }
    });
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