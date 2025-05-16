/**
 * @file helpers.ts
 * @brief Utility functions for asynchronous operations and template management.
 *
 * This module provides utility functions to facilitate asynchronous operations
 * and manage template IDs based on different template hosts.
 */

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
    case 'local-play-page':
    case 'remote-play-page':
    case 'tournament-play-page':
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

export function checkLoginStatus(): boolean {
  return localStorage.getItem('ID') !== null;
}
