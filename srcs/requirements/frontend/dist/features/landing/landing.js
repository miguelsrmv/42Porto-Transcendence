/**
 * @file landing.ts
 * @brief Handles the setup of the landing page.
 */
import { toggleLoginMenu } from "./loginMenu.js";
import { setLandingAnimations } from "../../ui/animations.js";
import { userIsLoggedIn } from "../auth/auth.service.js";
/**
 * @brief Adds event listeners for the landing view.
 *
 * This function sets up the event listener for the landing button, which navigates to the home view upon click.
 */
//TODO: If JWT already exists, login directly ?
export function initializeView() {
    const modal = document.getElementById("login-modal");
    const enterButton = document.getElementById("enter-button");
    // if (modal && enterButton) {
    // 	enterButton.addEventListener("click", async () => {
    // 		const loginStatus = await userIsLoggedIn()
    // 		if (loginStatus) {
    // 			window.location.hash = "main-menu-page";
    // 			return;
    // 		}
    //
    // 		modal.classList.toggle("hidden");
    // 		// Force reflow to ensure animation plays
    // 		void modal.offsetWidth;
    // 		modal.classList.remove("exiting");
    // 		modal.classList.add("entering");
    // 	});
    // }
    if (enterButton) {
        enterButton.addEventListener("click", async () => {
            try {
                // Navigate directly to main menu if logged in
                const isLoggedIn = await userIsLoggedIn();
                if (isLoggedIn) {
                    window.location.hash = "main-menu-page";
                    return;
                }
            }
            catch (error) {
                // TODO: Decide how to handle login check errors - maybe show modal anyway?
                console.error("Error checking login status:", error);
            }
            // Show Modal if not logged in (or if login check failed)
            if (modal) {
                // 1. Make modal visible (removes display: none)
                modal.classList.remove("hidden");
                // 2. Force browser reflow to register the element is now displayed
                void modal.offsetWidth;
                // 3. Modal transition
                modal.classList.remove("exiting");
                modal.classList.add("entering");
            }
        });
    }
    else {
        console.warn("#enter-button not found.");
    }
    const loginModal = document.getElementById("login-modal");
    if (loginModal && modal) {
        loginModal.addEventListener('click', function (event) {
            // Check if the click is outside the form (on the modal background)
            if (event.target === loginModal) {
                // Trigger the exit transition
                modal.classList.add("exiting");
                modal.classList.remove("entering");
                // Wait for transition to end, then hide the modal
                modal.addEventListener('transitionend', function handleTransitionEnd() {
                    // Remove the 'exiting' class and hide the modal
                    modal.classList.add('hidden');
                    modal.removeEventListener('transitionend', handleTransitionEnd);
                });
            }
        });
    }
    const loginButton = document.getElementById("login-button");
    //const guestButton = document.getElementById("guest-button");
    if (loginButton) { //&& guestButton) {
        loginButton.addEventListener("click", () => {
            toggleLoginMenu();
        }, { once: true });
        // guestButton.addEventListener("click", () => {
        // }, { once: true });
    }
    setLandingAnimations();
}
//# sourceMappingURL=landing.js.map