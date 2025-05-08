import { triggerPasswordModal, getPasswordModalValue } from './passwordModal.js';

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

  if (!userDataSubmitButtonListenerAttached) {
    userDataSubmitButton.addEventListener('click', () => {
      userDataSubmitButtonListenerAttached = true;
      fillUserData();
      if (confirmChanges()) submitUserData();
    });
  }

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

function confirmChanges(): boolean {
  triggerPasswordModal();
  let oldPassword = getPasswordModalValue();

  if (!oldPassword) return false;

  userData.oldPassword = oldPassword;
  return true;
}
