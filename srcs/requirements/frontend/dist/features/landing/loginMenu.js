import { attemptLogin, attemptRegister } from "../auth/auth.service.js";
/**
 * @file loginMenu.ts
 * @brief Manages the visibility and event handling for login and registration forms.
 *
 * This module provides functions to toggle the visibility of login and registration forms
 * and attach event listeners for form submissions to handle user authentication processes.
 */
let loginFormListenerAttached = false;
let registerFormListenerAttached = false;
/**
 * @brief Toggles the visibility of the login menu.
 *
 * This function hides the initial login buttons and toggles the visibility of the login form.
 * It also sets up an event listener for the login form submission to handle user login.
 *
 * @details The function ensures that the login form listener is attached only once to prevent
 * multiple submissions. It also manages the transition from the initial login buttons to the
 * login form.
 */
export function toggleLoginMenu() {
    var _a, _b;
    (_a = document.getElementById("initial-login-buttons")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
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
    (_b = document.getElementById("register-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => toggleRegisterMenu());
}
/**
 * @brief Toggles the visibility between the login and register forms.
 *
 * This function switches the display between the login form and the register form.
 * It also sets up an event listener for the register form submission to handle user registration.
 *
 * @details The function ensures that the register form listener is attached only once to prevent
 * multiple submissions. It manages the transition between the login and register forms.
 */
function toggleRegisterMenu() {
    var _a, _b;
    (_a = document.getElementById("login-form")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
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
            (_b = document.getElementById("back-register-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                registerForm.classList.toggle("hidden");
                const loginForm = document.getElementById("login-form");
                if (loginForm) {
                    loginForm.classList.toggle("hidden");
                }
            });
        }
    }
}
//# sourceMappingURL=loginMenu.js.map