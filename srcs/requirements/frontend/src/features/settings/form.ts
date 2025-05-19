import { confirmChanges } from './passwordModal.js';

type UserData = {
  username: string;
  email: string;
  newPassword: string;
  repeatPassword: string;
  oldPassword: string;
};

let userData: UserData;
let userDataSubmitButtonListenerAttached: boolean = false;

export function resetFormData(): void {
  userData = {
    username: '',
    email: '',
    newPassword: '',
    repeatPassword: '',
    oldPassword: '',
  };
}

export function handleUserDataChange(): void {
  const userDataSubmitButton = document.getElementById('settings-submit-button');
  if (!userDataSubmitButton) {
    console.log('No button to submit user data found');
    return;
  }

  //NOTE: Check if flag isn't necessary. REmoved as it caused a bug.
  //if (!userDataSubmitButtonListenerAttached) {
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
  //}

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

function updateLocalStorageData(username: string): void {
  window.localStorage.setItem('Username', username);
}

function updateHeaderData(): void {
  const headerUsername = document.getElementById('player-name');
  if (!headerUsername) {
    console.log("Couldn't find header usre name element");
    return;
  }
  headerUsername.innerText = window.localStorage.getItem('Username') as string;
}
