/**
 * Imports the list of available avatars.
 */
import { avatarList } from '../../ui/avatarData/avatarData.js';

let avatarIndex: number;
let isCustomAvatarListenerAdded = false;

/**
 * Initializes the avatar navigation loop, allowing users to cycle through avatars.
 *
 * This function sets up event listeners for the "previous" and "next" buttons
 * and updates the displayed avatar accordingly.
 */
export function createAvatarLoop(): void {
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

  /**
   * Updates the displayed avatar based on the current avatar index.
   */
  function updateAvatarDisplay(): void {
    if (userAvatar) userAvatar.src = avatarList[avatarIndex].imagePath;
  }

  // Event listener for the "previous" button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Decrement the index and cycle back to the end if necessary
      avatarIndex = avatarIndex === 0 ? avatarList.length - 1 : avatarIndex - 1;
      updateAvatarDisplay();
    });
  }

  // Event listener for the "next" button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Increment the index and cycle back to the start if necessary
      avatarIndex = avatarIndex === avatarList.length - 1 ? 0 : avatarIndex + 1;
      updateAvatarDisplay();
    });
  }

  // Initialize the first avatar display
  updateAvatarDisplay();
}

/**
 * Handles the submission of the selected avatar.
 *
 * This function sets up an event listener for the avatar submission button
 * and sends the selected avatar to the server.
 */
export function handleSubmitAvatar(): void {
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

  /**
   * Sends the selected default avatar's path to the server.
   */
  async function sendImagePath(): Promise<void> {
    try {
      const response = await fetch('/api/users/defaultAvatar', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: avatarList[avatarIndex].imagePath }),
      });
      updateLocalStorageAvatar();
    } catch (error) {
      console.log(`Default avatar upload error: ${error}`);
    }
  }

  /**
   * Handles the upload of a custom avatar.
   *
   * This function sets up an event listener for the custom avatar input
   * and sends the selected file to the server.
   */
  async function sendCustomAvatar(): Promise<void> {
    const customAvatar = document.getElementById('customAvatarInput') as HTMLInputElement;
    if (!customAvatar) {
      console.log("Couldn't find custom avatar input");
      return;
    }

    if (!isCustomAvatarListenerAdded) {
      customAvatar.addEventListener('change', async () => {
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
          updateLocalStorageAvatar();
          if (!response.ok) {
            console.error(`Upload failed with status ${response.status}`);
          } else {
            console.log('Custom avatar uploaded successfully');
          }
        } catch (error) {
          console.log(`Custom avatar upload error: ${error}`);
        }
      });

      isCustomAvatarListenerAdded = true;
    }

    customAvatar.click();
  }

  /**
   * Updates the avatar path in local storage and refreshes the header.
   */
  async function updateLocalStorageAvatar(): Promise<void> {
    try {
      const response = await fetch('/api/users/getAvatarPath', {
        method: 'GET',
        credentials: 'include',
      });
      const responseJson = await response.json();
      window.localStorage.setItem('AvatarPath', responseJson.path);
      refreshHeader();
    } catch (error) {
      console.log(`Error fetching avatar path: ${error}`);
    }
  }
}

/**
 * Resets the avatar index to the default value.
 *
 * @note The default value corresponds to Mario's index in the avatar list.
 */
export function resetAvatarIndex(): void {
  avatarIndex = 54;
}

/**
 * Refreshes the avatar displayed in the header.
 *
 * This function updates the header avatar image to reflect the current avatar
 * stored in local storage.
 */
function refreshHeader(): void {
  let headerAvatar = document.getElementById('nav-settings-avatar') as HTMLImageElement;
  let headerAvatarPath = window.localStorage.getItem('AvatarPath');
  if (headerAvatar && headerAvatarPath) headerAvatar.src = `${headerAvatarPath}?t=${Date.now()}`;
  // NOTE: Dummy string appended to prevent cache issues
}
