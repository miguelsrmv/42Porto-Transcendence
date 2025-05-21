/**
 * @file form.ts
 * @brief Handles user settings form functionality, including data submission and UI updates.
 */

import { confirmChanges } from './passwordModal.js';

/**
 * @typedef UserData
 * @brief Represents the structure of user data for the settings form.
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} newPassword - The new password entered by the user.
 * @property {string} repeatPassword - The repeated new password for confirmation.
 * @property {string} oldPassword - The current password of the user.
 */
type UserData = {
  username: string;
  email: string;
  newPassword: string;
  repeatPassword: string;
  oldPassword: string;
};

let userData: UserData;
let userDataSubmitButtonListenerAttached: boolean = false;

/**
 * @function resetFormData
 * @brief Resets the user data to its default empty state.
 */
export function resetFormData(): void {
  userData = {
    username: '',
    email: '',
    newPassword: '',
    repeatPassword: '',
    oldPassword: '',
  };
}

/**
 * @function handleUserDataChange
 * @brief Attaches an event listener to handle user data changes and submission.
 */
export function handleUserDataChange(): void {
  const userDataSubmitButton = document.getElementById('settings-submit-button');
  if (!userDataSubmitButton) {
    console.log('No button to submit user data found');
    return;
  }

  userDataSubmitButton.addEventListener('click', async () => {
    userDataSubmitButtonListenerAttached = true;
    fillUserData();
    if (userData.username || userData.email || (userData.newPassword && userData.repeatPassword)) {
      userData.oldPassword = (await confirmChanges()) as string;
      if (userData.oldPassword) await submitUserData();
      updateLocalStorageData(userData.username);
      updateHeaderData();
    } else {
      alert('Error: no valid input!');
    }
  });

  /**
   * @function submitUserData
   * @brief Submits the user data to the server via a PATCH request.
   * @returns {Promise<void>} A promise that resolves when the request completes.
   */
  async function submitUserData(): Promise<void> {
    try {
      const response = await fetch('/api/users/', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.log(`User Data change error`);
    }
  }

  /**
   * @function fillUserData
   * @brief Fills the userData object with values from the form inputs.
   */
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

/**
 * @function updateLocalStorageData
 * @brief Updates the local storage with the provided username.
 * @param {string} username - The username to store in local storage.
 */
function updateLocalStorageData(username: string): void {
  window.localStorage.setItem('Username', username);
}

/**
 * @function updateHeaderData
 * @brief Updates the header UI with the username from local storage.
 */
function updateHeaderData(): void {
  const headerUsername = document.getElementById('player-name');
  if (!headerUsername) {
    console.log("Couldn't find header usre name element");
    return;
  }
  headerUsername.innerText = window.localStorage.getItem('Username') as string;
}
