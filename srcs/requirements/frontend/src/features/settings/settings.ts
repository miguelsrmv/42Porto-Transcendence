/**
 * @file settings.ts
 * @brief Handles the setup of the settings page.
 */

import { avatarList } from '../../ui/avatarData/avatarData.js';

type UserData = {
  username: string;
  email: string;
  newPassword: string;
  repeatPassword: string;
};

let avatarIndex: number;
let userData: UserData;

/**
 * @brief Initializes view for settings
 *
 * This function sets up the view for rankings
 */
export async function initializeView(): Promise<void> {
  await resetFormData();
  updateFormPlaceholder();
  createAvatarLoop();
  handleSubmitAvatar();
  handleUserDataChange();
  handle2FA();
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
    fillUserData();
    submitUserData();
    // TODO: How to handle 2FA activation ?
  });

  async function submitUserData(): Promise<void> {
    try {
      const response = await fetch('/api/users/', {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.log(`User Data change error`);
    }
  }

  function fillUserData(): void {
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

    userData.username = usernameDataInput.value;
    userData.email = emailDataInput.value;
    userData.newPassword = passwordDataInput.value;
    userData.repeatPassword = retypePasswordDataInput.value;
  }
}

function handle2FA(): void {
  const twoFAToggle = document.getElementById('2fa-toggle-input') as HTMLInputElement;
  if (!twoFAToggle) {
    console.log('No 2 Factor Auth toggle found');
    return;
  }

  twoFAToggle.addEventListener('click', () => {
    const twoFAIsChecked = twoFAToggle.checked;

    if (twoFAIsChecked) {
      disable2FA(twoFAToggle);
    } else enable2FA(twoFAToggle);
  });
}

async function disable2FA(twoFAtoggle: HTMLInputElement): Promise<void> {
  try {
    const response = await fetch('/api/users/disableTwoFA', {
      method: 'POST',
      credentials: 'include',
    });
    twoFAtoggle.checked = false;
  } catch (error) {
    console.log(`User Data change error`);
    return;
  }
}

async function enable2FA(twoFAtoggle: HTMLInputElement): Promise<void> {
  try {
    const response = await fetch('/api/users/enableTwoFA', {
      method: 'POST',
      credentials: 'include',
    });
    twoFAtoggle.checked = true;
    // TODO: 2FA Setup logic
  } catch (error) {
    console.log(`User Data change error`);
    return;
  }
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

async function resetFormData(): Promise<void> {
  avatarIndex = 0;
  userData = {
    username: '',
    email: '',
    newPassword: '',
    repeatPassword: '',
  };

  let twoFAstatus;
  try {
    const response = await fetch('/api/users/checkTwoFAStatus', {
      method: 'GET',
      credentials: 'include',
    });
    twoFAstatus = await response.json();
  } catch (error) {
    console.log(`User Data change error`);
    return;
  }

  const twoFAtoggle = document.getElementById('2fa-toggle-input') as HTMLInputElement;
  if (!twoFAtoggle) {
    console.log('No 2 Factor Auth toggle found');
    return;
  }

  if (twoFAstatus) twoFAtoggle.checked = false;
  else twoFAtoggle.checked = true;
}
