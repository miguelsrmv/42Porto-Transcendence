/**
 * @file auth.service.ts
 * @brief Provides authentication services including login, registration, and session checking.
 *
 * This module contains functions to handle user authentication processes such as login,
 * registration, and checking if a user is logged in. It interacts with the backend API
 * to perform these operations.
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
import { loginErrorMessages, registerErrorMessages } from "../../constants/errorMessages.js";
/**
 * @brief Attempts to log in a user.
 *
 * This function handles the login form submission, sending the form data to the server
 * to authenticate the user. On success, it redirects the user to the main menu page.
 *
 * @param event The form submission event.
 */
export function attemptLogin(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault(); // Prevent default form submission
        const data = formToJSON(this);
        try {
            const response = yield fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                //TODO: Remove before delivering project!?
                console.error(`HTTP error" ${response.status}`);
                console.log("Response:", response);
                const errorLoginMessageContainer = document.getElementById("error-login-message");
                if (errorLoginMessageContainer) {
                    errorLoginMessageContainer.classList.remove("hidden");
                    const errorMessage = yield response.json();
                    errorLoginMessageContainer.innerText = loginErrorMessages[errorMessage.message];
                    return;
                }
            }
            window.location.hash = "main-menu-page";
            // Handle success (e.g., redirect or store token)
        }
        catch (error) {
            console.error("Login failed:", error);
            // Handle errors (e.g., show error message to user)
        }
    });
}
/**
 * @brief Attempts to register a new user.
 *
 * This function handles the registration form submission, sending the form data to the server
 * to create a new user account. On success, it toggles back to the login form.
 *
 * @param event The form submission event.
 */
export function attemptRegister(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        event.preventDefault();
        const data = formToJSON(this);
        try {
            const response = yield fetch('api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                //TODO: Remove before delivering project!?
                console.error(`HTTP error" ${response.status}`);
                console.log("Response:", response);
                const errorRegisterMessageContainer = document.getElementById("error-register-message");
                if (errorRegisterMessageContainer) {
                    errorRegisterMessageContainer.classList.remove("hidden");
                    const errorMessage = yield response.json();
                    errorRegisterMessageContainer.innerText = registerErrorMessages[errorMessage.message];
                    return;
                }
            }
            // If registry was successful, back to login form
            (_a = document.getElementById("login-form")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
            (_b = document.getElementById("register-form")) === null || _b === void 0 ? void 0 : _b.classList.toggle("hidden");
        }
        catch (error) {
            console.error("Register failed:", error);
            // Handle errors (e.g., show error message to user)
        }
    });
}
/**
 * @brief Checks if the user is logged in.
 *
 * This function sends a request to the server to verify if the user is currently logged in.
 * It returns true if the user is logged in, otherwise false.
 *
 * @return A promise that resolves to a boolean indicating the login status.
 */
export function userIsLoggedIn() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/users/checkLoginStatus', {
                method: 'GET',
                credentials: 'include', // ensures HttpOnly cookie is sent
            });
            return response.ok; // true if status is in 200–299 range
        }
        catch (error) {
            console.error("Login check failed:", error);
            return false;
        }
    });
}
/**
 * @brief Converts form data to a JSON object.
 *
 * This utility function takes a form element and converts its data into a JSON object
 * where each form field is a key-value pair.
 *
 * @param form The HTML form element to convert.
 * @return An object representing the form data as key-value pairs.
 */
function formToJSON(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
        data[key] = value.toString();
    });
    return data;
}
//# sourceMappingURL=auth.service.js.map