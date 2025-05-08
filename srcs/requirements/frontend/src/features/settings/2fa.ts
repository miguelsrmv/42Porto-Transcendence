let twoFAstatus;

export async function reset2FAData(): Promise<void> {
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

export function handle2FA(): void {
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
