/**
 * @file settings.ts
 * @brief Handles the setup of the settings page.
 */

import { avatarList } from '../../ui/avatarData/avatarData.js';

let avatarIndex: number = 0;

type UserData = {
  username: string | null;
  email: string | null;
  password: string | null;
  repeatPassword: string | null;
  twoFA: boolean;
};

let userData = {
  username: null,
  email: null,
  password: null,
  repeatPassword: null,
  twoFA: false,
};

/**
 * @brief Initializes view for settings
 *
 * This function sets up the view for rankings
 */

export async function initializeView(): Promise<void> {
  avatarIndex = 0;
  createAvatarLoop();
  handleSubmitAvatar();
  handleUserDataChange();
}

function createAvatarLoop(): void {
  const prevButton: HTMLButtonElement | null = document.getElementById(
    'previous-avatar',
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement | null = document.getElementById(
    'next-avatar',
  ) as HTMLButtonElement;
  const userAvatar: HTMLImageElement | null = document.getElementById(
    'user-avatar',
  ) as HTMLImageElement;

  if (!prevButton) {
    console.log("Couldn't find previous avatar navigation element");
    return;
  }

  if (!nextButton) {
    console.log("Couldn't find next avatar navigation element");
    return;
  }

  if (!userAvatar) {
    console.log("Couldn't find user avatar image element");
    return;
  }

  function updateAvatarDisplay(): void {
    if (userAvatar) userAvatar.src = avatarList[avatarIndex].imagePath;
  }

  // Event listener for previous button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Decrement the index and cycle back to the end if necessary
      avatarIndex = avatarIndex === 0 ? avatarList.length - 1 : avatarIndex - 1;
      updateAvatarDisplay();
    });
  }

  // Event listener for next button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Increment the index and cycle back to the start if necessary
      avatarIndex = avatarIndex === avatarList.length - 1 ? 0 : avatarIndex + 1;
      updateAvatarDisplay();
    });
  }

  // Initialize the first character
  updateAvatarDisplay();
}

function handleSubmitAvatar(): void {
  const submitButton = document.getElementById('avatar-submit-button');
  if (!submitButton) {
    console.log("Couldn't find submit button");
    return;
  }

  submitButton.addEventListener('click', () => {
    const avatarName = avatarList[avatarIndex].name;
    if (avatarName !== 'UploadYourOwn') sendImagePath();
    else sendCustomAvatar();
  });

  updateLocalStorageAvatar();

  async function sendImagePath(): Promise<void> {
    try {
      const response = await fetch('/api/users/defaultAvatar', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(avatarList[avatarIndex].imagePath),
      });
    } catch (error) {
      console.log(`Default avatar upload error: ${error}`);
    }
  }

  async function sendCustomAvatar(): Promise<void> {
    const customAvatar = document.getElementById('customAvatarInput') as HTMLInputElement;
    if (!customAvatar) {
      console.log("Couldn't find custom avatar input");
      return;
    }
    customAvatar.click();
    if (!customAvatar.files || customAvatar.files.length === 0) return;
    const file = customAvatar.files[0];

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/users/customAvatar', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
    } catch (error) {
      console.log(`Custon avatar upload error: ${error}`);
    }
  }

  async function updateLocalStorageAvatar(): Promise<void> {
    try {
      const response = await fetch('/api/users/getAvatarPath', {
        method: 'GET',
        credentials: 'include',
      });
      const responseJson = await response.json();
      window.localStorage.setItem('AvatarPath', responseJson.imagePath);
    } catch (error) {
      console.log(`Error fetching avatar path: ${error}`);
    }
  }
}

function handleUserDataChange(): void {
  const userDataSubmitButton = document.getElementById('settings-submit-button');
  if (!userDataSubmitButton) {
    console.log('No button to submit user data found');
    return;
  }

  userDataSubmitButton.addEventListener('click', () => {
    const usernameDataInput = document.getElementById(
      'username-settings-container',
    ) as HTMLInputElement;
    if (!usernameDataInput) {
      console.log('No username data input field found');
      return;
    }

    const emailDataInput = document.getElementById('email-settings-container') as HTMLInputElement;
    if (!emailDataInput) {
      console.log('No email data input field found');
      return;
    }

    const passwordDataInput = document.getElementById(
      'password-settings-container',
    ) as HTMLInputElement;
    if (!passwordDataInput) {
      console.log('No password data input field found');
      return;
    }

    const retypePasswordDataInput = document.getElementById(
      'retype-password-settings-container',
    ) as HTMLInputElement;
    if (!retypePasswordDataInput) {
      console.log('No retypePassword data input field found');
      return;
    }

    const twoFADataInput = document.getElementById('2FA-toggle-input') as HTMLInputElement;
    if (!twoFADataInput) {
      console.log('No twoFA data input field found');
      return;
    }

    userData.username = usernameDataInput.value;
  });
}

// TODO: Change email
// TODO: Change avatar
// TODO: Change password
// TODO: Change username
// TODO: Enable/Disable 2FA
