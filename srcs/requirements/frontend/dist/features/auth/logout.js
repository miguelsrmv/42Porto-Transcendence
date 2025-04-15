export async function logoutUser() {
    try {
        await fetch('api/users/logout'), {
            method: 'DELETE',
            credentials: 'include',
        };
    }
    catch (error) {
        console.error("Logout failed: ", error);
    }
}
//# sourceMappingURL=logout.js.map