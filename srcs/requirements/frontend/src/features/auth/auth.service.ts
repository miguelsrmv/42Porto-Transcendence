/**
 * @file auth.service.ts
 * @brief Provides authentication services including login, registration, and session checking.
 *
 * This module contains functions to handle user authentication processes such as login,
 * registration, and checking if a user is logged in. It interacts with the backend API
 * to perform these operations.
 */

import { loginErrorMessages, registerErrorMessages } from '../../constants/errorMessages.js';

/**
 * @brief Attempts to log in a user.
 *
 * This function handles the login form submission, sending the form data to the server
 * to authenticate the user. On success, it redirects the user to the main menu page.
 *
 * @param event The form submission event.
 */
export async function attemptLogin(form: HTMLFormElement, event: Event) {
  event.preventDefault(); // Prevent default form submission

  const data = formToJSON(form);

  try {
    const response = await fetch('/api/users/preLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`HTTP error" ${response.status}`);
      console.log('Response:', response);
      const errorLoginMessageContainer = document.getElementById('error-login-message');
      if (errorLoginMessageContainer) {
        errorLoginMessageContainer.classList.remove('hidden');
        const errorMessage = await response.json();
        errorLoginMessageContainer.innerText = loginErrorMessages[errorMessage.message];
        return;
      }
    }

    const responseJson = await response.json();

    if (responseJson.enabled2FA) {
      await loginWith2FA(data);
    } else {
      await loginWithout2FA(data);
    }
  } catch (error) {
    console.error('Login failed:', error);
    // Handle errors (e.g., show error message to user)
  }
}

async function loginWith2FA(data: Record<string, string>): Promise<void> {
  const loginForm = document.getElementById('login-form');
  const authForm = document.getElementById('2fa-form') as HTMLFormElement;
  const authInput = document.getElementById('authentication-code') as HTMLInputElement;
  const error2FAMessageContainer = document.getElementById('error-2fa-code') as HTMLDivElement;

  if (!loginForm || !authForm || !authInput || !error2FAMessageContainer) {
    console.error('Missing form elements for 2FA login');
    return;
  }

  // Hide login form and show 2FA form
  loginForm.classList.add('hidden');
  authForm.classList.remove('hidden');

  // Prevent multiple listener bindings
  if (authForm.dataset.listenerAttached === 'true') return;
  authForm.dataset.listenerAttached = 'true';

  return new Promise<void>((resolve, reject) => {
    // Listen for the submit event of the 2FA form
    authForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      const code = authInput.value.trim();
      if (!code) {
        alert('Please enter the authentication code'); // User feedback if no code entered
        return;
      }

      data['code'] = code; // Attach the code to the login data

      try {
        const response = await fetch('/api/users/login2FA', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          error2FAMessageContainer.classList.remove('hidden');
          const errorMessage = await response.text();
          console.log(errorMessage);
          error2FAMessageContainer.innerText = errorMessage;
          reject('Failed 2FA login');
          return;
        }

        // Successfully logged in with 2FA, fetch user data and redirect
        await fetchUserData();
        window.location.hash = 'main-menu-page'; // Handle success (e.g., redirect)
        resolve();
      } catch (error) {
        console.error('2FA Login failed:', error);
        reject('Failed 2FA login');
      }
    });
  });
}

async function loginWithout2FA(data: Record<string, string>): Promise<void> {
  const loginForm = document.getElementById('login-form') as HTMLFormElement;

  if (!loginForm) {
    console.log("Error, couldn't find login form");
    return;
  }
  loginForm.dataset.listenerAttached = 'true';

  const formData = new FormData(loginForm);
  formData.forEach((value, key) => {
    data[key] = value as string; // Populate the data object with form values
  });

  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      const errorLoginMessageContainer = document.getElementById('error-login-message');
      if (errorLoginMessageContainer) {
        errorLoginMessageContainer.classList.remove('hidden');
        const errorMessage = await response.json();
        errorLoginMessageContainer.innerText = loginErrorMessages[errorMessage.message];
      }
      return;
    }

    await fetchUserData();
    window.location.hash = 'main-menu-page'; // Handle success (e.g., redirect)
  } catch (error) {
    console.error('Login failed:', error);
  }
}

async function fetchUserData() {
  const response = await fetch('/api/users/me', {
    method: 'GET',
    credentials: 'include',
  });

  let responsejson = await response.json();

  window.localStorage.setItem('Username', responsejson.username);
  window.localStorage.setItem('Email', responsejson.email);
  window.localStorage.setItem('ID', responsejson.id);
  window.localStorage.setItem('AvatarPath', responsejson.avatarUrl);
}

/**
 * @brief Attempts to register a new user.
 *
 * This function handles the registration form submission, sending the form data to the server
 * to create a new user account. On success, it toggles back to the login form.
 *
 * @param event The form submission event.
 */
export async function attemptRegister(this: HTMLFormElement, event: Event) {
  event.preventDefault();

  const data = formToJSON(this);

  try {
    const response = await fetch('api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      //TODO: Remove before delivering project!?
      console.error(`HTTP error" ${response.status}`);
      console.log('Response:', response);
      const errorRegisterMessageContainer = document.getElementById('error-register-message');
      if (errorRegisterMessageContainer) {
        errorRegisterMessageContainer.classList.remove('hidden');
        const errorMessage = await response.json();
        errorRegisterMessageContainer.innerText = registerErrorMessages[errorMessage.message];
        return;
      }
    }

    // If registry was successful, back to login form
    document.getElementById('login-form')?.classList.toggle('hidden');
    document.getElementById('register-form')?.classList.toggle('hidden');
  } catch (error) {
    console.error('Register failed:', error);
    // Handle errors (e.g., show error message to user)
  }
}

/**
 * @brief Checks if the user is logged in.
 *
 * This function sends a request to the server to verify if the user is currently logged in.
 * It returns true if the user is logged in, otherwise false.
 *
 * @return A promise that resolves to a boolean indicating the login status.
 */
export async function userIsLoggedIn(): Promise<boolean> {
  try {
    const response = await fetch('/api/users/checkLoginStatus', {
      method: 'GET',
      credentials: 'include', // ensures HttpOnly cookie is sent
    });
    return response.ok; // true if status is in 200–299 range
  } catch (error) {
    console.error('Login check failed:', error);
    return false;
  }
}

/**
 * @brief Converts form data to a JSON object.
 *
 * This utility function takes a form element and converts its data into a JSON object
 * where each form field is a key-value pair.
 *
 * @param form The HTML form element to convert.
 * @return An object representing the form data as key-value pairs.
 */
function formToJSON(form: HTMLFormElement): { [key: string]: string } {
  const data: { [key: string]: string } = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value.toString();
  });
  return data;
}
