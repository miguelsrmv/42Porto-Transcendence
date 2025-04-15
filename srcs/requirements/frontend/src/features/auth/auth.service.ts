export async function attemptLogin(this: HTMLFormElement, event: Event) {
	event.preventDefault(); // Prevent default form submission

	const data = formToJSON(this);

	try {
		const response = await fetch('/api/users/login', {
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

		window.location.hash = "main-menu-page";
		// Handle success (e.g., redirect or store token)
	} catch (error) {
		console.error("Login failed:", error);
		// Handle errors (e.g., show error message to user)
	}
}

export async function attemptRegister(this: HTMLFormElement, event: Event) {
	event.preventDefault();


	const data = formToJSON(this);

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
		document.getElementById("login-form")?.classList.toggle("hidden");
		document.getElementById("register-form")?.classList.toggle("hidden");

		// Handle success (e.g., redirect or store token)
	} catch (error) {
		console.error("Register failed:", error);
		// Handle errors (e.g., show error message to user)
	}

}

export async function userIsLoggedIn(): Promise<boolean> {
	try {
		const response = await fetch('/api/users/checkLoginStatus', {
			method: 'GET',
			credentials: 'include', // ensures HttpOnly cookie is sent
		});
		return response.ok; // true if status is in 200–299 range

	} catch (error) {
		console.error("Login check failed:", error);
		return false;
	}
}

function formToJSON(form: HTMLFormElement): { [key: string]: string } {
	const data: { [key: string]: string } = {};
	new FormData(form).forEach((value, key) => {
		data[key] = value.toString();
	});
	return data;
}
