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
  if (!checkLoginStatus()) {
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

function resetPageData(): void {
  resetAvatarIndex();
  resetFormData();
}

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
