export async function logoutUser() {
	try {
		await fetch('api/users/logout');
	}
	catch (error) {
		console.error("Logout failed: ", error);
	}
}
