import { avatarList } from '../../ui/avatarData/avatarData.js';
let avatarIndex: number;

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

  updateLocalStorageAvatar();

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

    // Listen once to the 'change' event
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

        if (!response.ok) {
          console.error(`Upload failed with status ${response.status}`);
        } else {
          console.log('Custom avatar uploaded successfully');
        }
      } catch (error) {
        console.log(`Custom avatar upload error: ${error}`);
      }
    });

    customAvatar.click();
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

export function resetAvatarIndex(): void {
  avatarIndex = 0;
}
