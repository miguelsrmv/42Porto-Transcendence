/**
 * @file landing.ts
 * @brief Handles the setup of the landing page.
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
    if (modal && enterButton) {
        enterButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const loginStatus = yield userIsLoggedIn();
            if (loginStatus) {
                window.location.hash = "main-menu-page";
                return;
            }
            modal.style.display = "block";
            // Force reflow to ensure animation plays
            void modal.offsetWidth;
            modal.classList.remove("exiting");
            modal.classList.add("entering");
        }));
    }
    const loginButton = document.getElementById("login-button");
    const guestButton = document.getElementById("guest-button");
    if (loginButton && guestButton) {
        loginButton.addEventListener("click", () => {
            toggleLoginMenu();
        }, { once: true });
        guestButton.addEventListener("click", () => {
        }, { once: true });
    }
    setLandingAnimations();
}
//# sourceMappingURL=landing.js.map