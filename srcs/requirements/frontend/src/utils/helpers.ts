/**
 * @file helpers.ts
 * @brief Utility functions for asynchronous operations and template management.
 *
 * This module provides utility functions to facilitate asynchronous operations
 * and manage template IDs based on different template hosts.
 */

import { userIsLoggedIn } from '../features/auth/auth.service.js';

/**
 * @brief Pauses execution for a specified number of seconds.
 *
 * This function returns a promise that resolves after a given number of seconds,
 * effectively pausing the execution of asynchronous code for the specified duration.
 *
 * @param seconds The number of seconds to wait before the promise resolves.
 * @return A promise that resolves after the specified delay.
 */
export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * @brief Retrieves the template ID based on the template host.
 *
 * This function maps a given template host to its corresponding template ID.
 * It returns the appropriate template ID for known template hosts or undefined
 * if the template host is not recognized.
 *
 * @param templateHost The name of the template host.
 * @return The corresponding template ID or undefined if not found.
 */
export function getTemplateId(templateHost: string): string | undefined {
  switch (templateHost) {
    case 'header':
      return 'header-template';
    case 'landing-page':
      return 'landing-template';
    case 'main-menu-page':
      return 'main-menu-template';
    case 'local-match-page':
    case 'remote-match-page':
    case 'local-tournament-page':
    case 'remote-tournament-page':
      return 'game-menu-template';
    case 'settings-page':
      return 'settings-template';
    case 'friends-page':
      return 'friends-template';
    case 'rankings-page':
      return 'rankings-template';
    case 'error-page':
      return 'error-template';
    case 'game-page':
      return 'game-template';
  }
}

/**
 * @brief Checks the login status of the user.
 *
 * This function checks whether the user is logged in by calling an external
 * service. If the user is not logged in, it clears the local storage. It then
 * verifies the presence of a user ID in local storage to determine the login status.
 *
 * @return A promise that resolves to true if the user is logged in, false otherwise.
 */

export async function checkLoginStatus(): Promise<boolean> {
  const loggedInStatus = await userIsLoggedIn();

  if (loggedInStatus === false) window.localStorage.clear();
  else if (loggedInStatus === undefined) alert('An error ocurred checking your login status');

  // NOTE: This will assume an undefined error (such as backend dropping) won't log out the user!

  return localStorage.getItem('ID') !== null;
}

/**
 * @brief Capitalizes the first letter of a given word.
 *
 * This function takes a string and returns a new string with the first letter
 * converted to uppercase while leaving the rest of the string unchanged.
 *
 * @param word The input string to capitalize.
 * @return The capitalized string.
 */
export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  const result = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);

  return result;
}
