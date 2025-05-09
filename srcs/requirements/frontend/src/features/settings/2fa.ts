let twoFAstatus;

export async function reset2FAData(): Promise<void> {
  try {
    const response = await fetch('/api/users/2FA/check', {
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
      enable2FA(twoFAToggle);
    } else {
      disable2FA(twoFAToggle);
    }
  });
}

async function disable2FA(twoFAtoggle: HTMLInputElement): Promise<void> {
  try {
    const response = await fetch('/api/users/2FA/disable', {
      method: 'GET',
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
    const response = await fetch('/api/users/2FA/setup', {
      method: 'GET',
      credentials: 'include',
    });
    twoFAtoggle.checked = true;
    console.log(`${response}`);
  } catch (error) {
    console.log(`User Data change error`);
    return;
  }
}
