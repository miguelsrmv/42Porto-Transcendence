import { attemptLogin, attemptRegister } from "../auth/auth.service.js";
let loginFormListenerAttached = false;
let registerFormListenerAttached = false;
/**
 * @brief Toggles the visibility of the login menu.
 *
 * This function hides the initial login buttons and toggles the visibility of the login form.
 * It also sets up an event listener for the login form submission to handle user login.
 */
export function toggleLoginMenu() {
    document.getElementById("initial-login-buttons")?.classList.add("hidden");
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.classList.toggle("hidden");
        if (!loginFormListenerAttached) {
            if (loginForm instanceof HTMLFormElement) {
                loginForm.addEventListener("submit", function (event) {
                    attemptLogin.call(this, event);
                });
                loginFormListenerAttached = true;
            }
        }
    }
    document.getElementById("register-button")?.addEventListener("click", () => toggleRegisterMenu());
}
/**
 * @brief Toggles the visibility between the login and register forms.
 *
 * This function switches the display between the login form and the register form.
 * It also sets up an event listener for the register form submission to handle user registration.
 */
function toggleRegisterMenu() {
    document.getElementById("login-form")?.classList.toggle("hidden");
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.classList.toggle("hidden");
        if (!registerFormListenerAttached) {
            if (registerForm instanceof HTMLFormElement) {
                registerForm.addEventListener("submit", function (event) {
                    attemptRegister.call(this, event);
                });
                registerFormListenerAttached = true;
            }
        }
    }
}
//# sourceMappingURL=loginMenu.js.map