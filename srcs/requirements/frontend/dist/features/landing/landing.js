import { toggleLoginMenu } from "../auth/loginModal.js";
import { setLandingAnimations } from "../../ui/animations.js";
import { setLoginStatus } from "../../app.js";
/**
 * @brief Adds event listeners for the landing view.
 *
 * This function sets up the event listener for the landing button, which navigates to the home view upon click.
 */
export function initializeView() {
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
            setLoginStatus("login");
        }, { once: true });
        guestButton.addEventListener("click", () => {
            setLoginStatus("guest");
        }, { once: true });
    }
    setLandingAnimations();
}
//# sourceMappingURL=landing.js.map