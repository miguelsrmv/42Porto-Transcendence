let token = null;
export function setToken(newToken) {
    token = newToken;
}
export function getToken() {
    return token;
}
export function clearToken() {
    token = null;
}
export async function attemptLogin(event) {
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
        setToken(result.token);
        window.location.hash = "main-menu-page";
        // Handle success (e.g., redirect or store token)
    }
    catch (error) {
        console.error("Login failed:", error);
        // Handle errors (e.g., show error message to user)
    }
}
//# sourceMappingURL=auth.service.js.map