export function toggleLoginMenu() {
    const initialLoginButtons = document.getElementById("initial-login-buttons");
    if (initialLoginButtons)
        initialLoginButtons.classList.add("hidden");
    const loginForm = document.getElementById("login-form");
    if (loginForm)
        loginForm.classList.toggle("hidden");
    document.getElementById("login-form")?.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
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
            const result = await response.json();
            console.log("Login successful:", result);
            // Handle success (e.g., redirect or store token)
        }
        catch (error) {
            console.error("Login failed:", error);
            // Handle errors (e.g., show error message to user)
        }
    });
    const registerButton = document.getElementById("register-button");
    if (registerButton)
        registerButton.addEventListener("click", () => toggleRegisterMenu());
}
function toggleRegisterMenu() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    if (loginForm && registerForm) {
        loginForm.classList.toggle("hidden");
        registerForm.classList.toggle("hidden");
    }
}
//# sourceMappingURL=loginModal.js.map