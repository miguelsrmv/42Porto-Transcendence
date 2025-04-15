import { setToken, attemptLogin } from "../auth/auth.service.js"

let loginFormListenerAttached = false;

/**
 * @brief Toggles the visibility of the login menu.
 * 
 * This function hides the initial login buttons and toggles the visibility of the login form.
 * It also sets up an event listener for the login form submission to handle user login.
 */
export function toggleLoginMenu(): void {
	document.getElementById("initial-login-buttons")?.classList.add("hidden");

	const loginForm = document.getElementById("login-form");
	if (loginForm) {
		loginForm.classList.toggle("hidden");

		if (!loginFormListenerAttached) {
			if (loginForm instanceof HTMLFormElement) {
				loginForm.addEventListener("submit", function(event) {
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
 */
function toggleRegisterMenu(): void {
	const loginForm = document.getElementById("login-form");
	const registerForm = document.getElementById("register-form");

	if (loginForm && registerForm) {
		loginForm.classList.toggle("hidden");
		registerForm.classList.toggle("hidden");
	}

	document.getElementById("register-form")?.addEventListener("submit", async function(event) {
		event.preventDefault();

		const formData = new FormData(this as HTMLFormElement);

		const data: { [key: string]: string } = {};
		formData.forEach((value, key) => {
			data[key] = value.toString();
		});

		try {
			const response = await fetch('api/users', {
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

			// If registry was successful, back to login form
			if (loginForm && registerForm) {
				loginForm.classList.toggle("hidden");
				registerForm.classList.toggle("hidden");
			}

			window.location.hash = "main-menu-page";
			// Handle success (e.g., redirect or store token)
		} catch (error) {
			console.error("Register failed:", error);
			// Handle errors (e.g., show error message to user)
		}
	});
}

