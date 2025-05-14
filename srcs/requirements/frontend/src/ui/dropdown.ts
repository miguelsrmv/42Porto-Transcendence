/**
 * @file dropdown.ts
 * @brief Provides functionality to toggle the visibility of a dropdown menu in the UI.
 *
 * This module includes functions that manage the display of dropdown menus, enhancing
 * user interaction by allowing elements to be shown or hidden based on user actions.
 */

import { userIsLoggedIn } from '../features/auth/auth.service.js';
import { logoutUser } from '../features/auth/logout.js';

/**
 * @brief Toggles the visibility of a dropdown menu.
 *
 * This function manages the visibility of a dropdown menu associated with a button.
 * It toggles the dropdown's visibility when the button is clicked and hides the dropdown
 * when clicking outside of it.
 */
export async function toggleDropdown(): Promise<void> {
  const button = document.getElementById('nav-settings-button');
  const dropdown = document.getElementById('settings-dropdown');

  if (!button || !dropdown) return;

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Node;
    if (!button.contains(target) && !dropdown.contains(target)) {
      dropdown.classList.add('hidden');
    }
  });

  const logoutButton = document.getElementById('logout-button');
  const settingsButton = document.getElementById('settings-dropdown-button');
  const loginStatus = await userIsLoggedIn();

  if (logoutButton && settingsButton) {
    if (loginStatus) {
      logoutButton.innerText = 'Log Out';
      settingsButton.classList.remove('hidden');
    } else {
      logoutButton.innerText = 'Exit';
      settingsButton.classList.add('hidden');
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      if (loginStatus) {
        await logoutUser();
      }
      window.location.hash = '#';
    });
  }
}
