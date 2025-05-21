/**
 * @file settings.ts
 * @brief Handles the setup of the settings page.
 */

import { createAvatarLoop, handleSubmitAvatar, resetAvatarIndex } from './avatar.js';
import { handleUserDataChange, resetFormData } from './form.js';
import { handle2FA } from './2fa.js';
import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';

/**
 * @>brief Initializes view for settings
 *
 * This function sets up the view for rankings
 */
export async function initializeView(): Promise<void> {
  if (!(await checkLoginStatus())) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }

  resetPageData();
  updateFormPlaceholder();
  createAvatarLoop();
  handleSubmitAvatar();
  handleUserDataChange();
  handle2FA();
}

/**
 * @brief Resets the data on the settings page.
 *
 * This function resets the avatar index and form data to their initial states.
 */
function resetPageData(): void {
  resetAvatarIndex();
  resetFormData();
}

/**
 * @brief Updates the placeholders for the username and email fields.
 *
 * This function retrieves the stored username and email from local storage
 * and sets them as placeholders in the respective input fields on the settings page.
 * If the fields are not found, it logs an error message to the console.
 */
function updateFormPlaceholder(): void {
  const changeUsernameField = document.getElementById(
    'username-settings-container',
  ) as HTMLInputElement;
  if (!changeUsernameField) {
    console.log('Could not find username field');
    return;
  }

  const changeEmailField = document.getElementById('email-settings-container') as HTMLInputElement;
  if (!changeUsernameField) {
    console.log('Could not find username field');
    return;
  }

  const storedUsername = window.localStorage.getItem('Username');
  if (storedUsername) changeUsernameField.placeholder = storedUsername;

  const storedEmail = window.localStorage.getItem('Email');
  if (storedEmail) changeEmailField.placeholder = storedEmail;
}
