import { attemptLogin, attemptRegister } from "../auth/auth.service.js"

/**
 * @file loginMenu.ts
 * @brief Manages the login and registration modals.
 * 
 * This module handles the display and interaction logic for the login and registration
 * modals, including event listener management and form toggling.
 */

// Track whether event listeners have been attached
let loginFormListenerAttached: boolean = false;
let registerFormListenerAttached: boolean = false;
let modalClickListenerAttached: boolean = false;

/**
 * @brief Shows the login modal with smooth transitions.
 * 
 * This function makes the login modal visible and sets up the necessary event listeners
 * for handling user interactions with the modal.
 */
export function triggerLoginModal(): void {
	const loginModal = document.getElementById("login-modal");

	// Show loginModal if not logged in (or if login check failed)
	if (loginModal) {
		// Clean up any existing event listener before adding a new one
		if (modalClickListenerAttached) {
			loginModal.removeEventListener('click', handleModalOutsideClick);
		}

		// 1. Make loginModal visible 
		loginModal.classList.remove("hidden");

		// 2. Force browser reflow to register the element is now displayed
		void loginModal.offsetWidth;

		// 3. Add entrance transition
		loginModal.classList.remove("exiting");
		loginModal.classList.add("entering");

		// 4. Set up one click handler for outside clicks
		loginModal.addEventListener('click', handleModalOutsideClick);
		modalClickListenerAttached = true;
	} else {
		console.warn("#login-modal not found.");
	}

	toggleLoginMenu();
}

/**
 * @brief Handles clicks outside the modal to close it.
 * 
 * This function checks if a click event occurred outside the modal content
 * and closes the modal if so.
 * 
 * @param event The mouse event triggered by the click.
 */
function handleModalOutsideClick(event: MouseEvent): void {
	// No need for another console warn (already done on triggerLoginModal)
	const loginModal = document.getElementById("login-modal");
	if (!loginModal) return;

	// Check if the click is outside the form (on the loginModal background)
	if (event.target === loginModal) {
		closeLoginModal();
	}
}

/**
 * @brief Closes the login modal with a smooth exit transition.
 * 
 * This function initiates the exit transition for the login modal and sets up
 * an event listener to hide the modal once the transition is complete.
 */
function closeLoginModal(): void {
	// No need for another console warn (already done on triggerLoginModal)
	const loginModal = document.getElementById("login-modal");
	if (!loginModal) return;

	// Trigger the exit transition
	loginModal.classList.add("exiting");
	loginModal.classList.remove("entering");

	// Remove the existing transition listener if any
	loginModal.removeEventListener('transitionend', handleModalTransitionEnd);

	// Wait for transition to end, then hide the loginModal
	loginModal.addEventListener('transitionend', handleModalTransitionEnd);
}

/**
 * @brief Handles the end of modal transitions.
 * 
 * This function is called when the modal's transition ends and is responsible
 * for hiding the modal and cleaning up event listeners.
 * 
 * @param event The transition event triggered by the end of the transition.
 */
function handleModalTransitionEnd(event: TransitionEvent): void {
	const loginModal = document.getElementById("login-modal");
	if (!loginModal) return;

	if (loginModal.classList.contains("exiting")) {
		// Remove the 'exiting' class and hide the loginModal
		loginModal.classList.add('hidden');
		// Remove the event listener to prevent memory leaks
		loginModal.removeEventListener('transitionend', handleModalTransitionEnd);
	}
}

/**
 * @brief Toggles the visibility of the login menu.
 * 
 * This function manages the visibility of the login form and sets up the necessary
 * event listeners for form submission and navigation to the registration form.
 */
function toggleLoginMenu(): void {
	const loginForm = document.getElementById("login-form");

	if (loginForm) {
		// Only attach the listener once
		if (!loginFormListenerAttached) {
			const loginButton = document.getElementById("login-submit-button");
			if (loginButton) {
				loginButton.addEventListener("click", function(event) {
					attemptLogin.call(loginForm as HTMLFormElement, event);
				});
				loginFormListenerAttached = true;
			}
		}

		const showRegisterButton = document.getElementById("show-register-button");
		if (showRegisterButton) {
			// Remove existing listener to prevent duplicates
			showRegisterButton.removeEventListener("click", handleRegisterButtonClick);
			// Add the click listener
			showRegisterButton.addEventListener("click", handleRegisterButtonClick);
		} else {
			console.warn("#show-register-button not found.");
		}
	} else {
		console.warn("#login-form not found.");
	}
}

/**
 * @brief Handles register button clicks.
 * 
 * This function toggles the visibility of the login form and switches to the
 * registration form when the register button is clicked.
 */
function handleRegisterButtonClick(): void {
	const loginForm = document.getElementById("login-form");
	if (loginForm) {
		loginForm.classList.toggle("hidden");
	}
	toggleRegisterMenu();
}

/**
 * @brief Toggles the visibility between the login and register forms.
 * 
 * This function switches the display between the login form and the register form
 * and sets up event listeners for the register form.
 */
function toggleRegisterMenu(): void {
	const registerForm = document.getElementById("register-form");
	if (!registerForm) {
		console.warn("#register-form not found.");
		return;
	}

	registerForm.classList.toggle("hidden");

	if (!registerFormListenerAttached) {
		const registerButton = document.getElementById("register-submit-button");
		if (registerButton) {
			registerButton.addEventListener("click", function(event) {
				attemptRegister.call(registerForm as HTMLFormElement, event);
			});
			registerFormListenerAttached = true;
		}

		const showLoginButton = document.getElementById("show-login-button");
		if (showLoginButton) {
			// Remove existing listener to prevent duplicates
			showLoginButton.removeEventListener("click", handleBackRegisterClick);
			// Add the click listener
			showLoginButton.addEventListener("click", handleBackRegisterClick);
		} else {
			console.warn("#show-login-button not found.");
		}
	}
}

/**
 * @brief Handles back button clicks on the register form.
 * 
 * This function toggles the visibility of the register form and switches back
 * to the login form when the back button is clicked.
 */
function handleBackRegisterClick(): void {
	const registerForm = document.getElementById("register-form");
	if (registerForm) {
		registerForm.classList.toggle("hidden");
	}

	const loginForm = document.getElementById("login-form");
	if (loginForm) {
		loginForm.classList.toggle("hidden");
	} else {
		console.warn("#login-form not found.");
	}
}
