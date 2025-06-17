/**
 * @file logout.ts
 * @brief Handles user logout functionality.
 *
 * This module provides a function to log out the user by sending a request to the server
 * to terminate the user's session.
 */

/**
 * @brief Logs out the current user.
 *
 * This function sends a DELETE request to the server to log out the user. It handles any
 * errors that occur during the logout process by logging them to the console.
 */

export async function logoutUser() {
  try {
    await fetch('/api/users/logout', {
      method: 'DELETE',
      credentials: 'include',
    });
    window.localStorage.clear();
  } catch (error) {
    console.error('Logout failed: ', error);
  }
}
