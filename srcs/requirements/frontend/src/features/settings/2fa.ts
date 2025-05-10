async function fetch2FAStatus(): Promise<boolean | undefined> {
  try {
    const response = await fetch('/api/users/2FA/check', {
      method: 'GET',
      credentials: 'include',
    });
    const twoFAstatus = await response.json();
    return twoFAstatus;
  } catch (error) {
    console.log(`2FA status fetch error`);
    return undefined;
  }
}

export async function reset2FAData(): Promise<void> {
  const twoFAtoggle = document.getElementById('2fa-toggle-input') as HTMLInputElement;
  if (!twoFAtoggle) {
    console.log('No 2 Factor Auth toggle found');
    return;
  }

  let twoFAstatus = await fetch2FAStatus();

  if (twoFAstatus) twoFAtoggle.checked = true;
  else twoFAtoggle.checked = false;
}

export function handle2FA(): void {
  const twoFAToggle = document.getElementById('2fa-toggle-input') as HTMLInputElement;
  if (!twoFAToggle) {
    console.log('No 2 Factor Auth toggle found');
    return;
  }
  const twoFAmodal = document.getElementById('twoFA-modal');
  if (!twoFAmodal) {
    console.log('No 2 Factor Auth modal found');
    return;
  }

  const confirmButton = document.getElementById('twoFA-button') as HTMLButtonElement;
  if (!confirmButton) {
    console.error('Missing QR modal confirm button');
    return;
  }

  // Handle transition and hide logic
  const close = () => {
    twoFAmodal.classList.add('exiting');
    twoFAmodal.classList.remove('entering');

    const onTransitionEnd = () => {
      twoFAmodal.classList.add('hidden');
      twoFAmodal.removeEventListener('transitionend', onTransitionEnd);
    };

    twoFAmodal.addEventListener('transitionend', onTransitionEnd, { once: true });
  };

  // Clicking outside the modal (backdrop)
  const onBackdropClick = async (event: MouseEvent) => {
    if (event.target === twoFAmodal) {
      await reset2FAData();
      close();
    }
  };

  // Clicking confirm button
  const onConfirmClick = async () => {
    const is2FAenabled = await fetch2FAStatus();
    // NOTE: Don't use pure else because of "undefined" return value!!
    console.log(`Status is ${is2FAenabled}`);
    if (!is2FAenabled == false) {
      enable2FA(twoFAToggle);
    } else if (!is2FAenabled == true) {
      disable2FA(twoFAToggle);
    }
    close();
  };

  // Clean-up any previous listeners (safety)
  twoFAmodal.removeEventListener('click', onBackdropClick);
  confirmButton.removeEventListener('click', onConfirmClick);

  // Register one-time listeners
  twoFAmodal.addEventListener('click', onBackdropClick);
  confirmButton.addEventListener('click', onConfirmClick);

  twoFAToggle.addEventListener('click', async () => {
    // Show modal
    twoFAmodal.classList.remove('hidden');
    void twoFAmodal.offsetWidth;
    twoFAmodal.classList.remove('exiting');
    twoFAmodal.classList.add('entering');

    // Update modal content
    await toggleQRModalView(twoFAToggle);
  });
}

async function toggleQRModalView(twoFAToggle: HTMLInputElement): Promise<void> {
  const headerText = document.getElementById('qr-modal-header');
  if (!headerText) {
    console.log('QR header text not found');
    return;
  }

  const qrCode = document.getElementById('QR-code');
  if (!qrCode) {
    console.log('QR-code element not found');
    return;
  }

  const QRplaceholder = document.getElementById('QR-code') as HTMLImageElement;
  if (!QRplaceholder) {
    console.log("Couldn't find QR-code placeholder");
    return;
  }

  const submitButton = document.getElementById('twoFA-button') as HTMLButtonElement;
  if (!submitButton) {
    console.log("Couldn't find submit button");
    return;
  }

  if (twoFAToggle.checked) {
    try {
      const response = await fetch('/api/users/2FA/setup', {
        method: 'GET',
        credentials: 'include',
      });
      const URI = await response.text();
      QRplaceholder.src = URI;
    } catch (error) {
      console.log(`QR Code get error: ${error}`);
      return;
    }
    headerText.innerText = 'Scan this QR code with your Authenticator app';
    qrCode.classList.remove('hidden');
    submitButton.innerText = 'Send Code';
    submitButton.classList.add('bg-blue-600', 'hover-bg-blue-700', 'focus:ring-blue-500');
    submitButton.classList.remove('bg-red-600', 'hover-bg-red-700', 'focus:ring-red-500');
  } else {
    headerText.innerText = 'Enter authenticator code and password to disable 2FA';
    qrCode.classList.add('hidden');
    submitButton.innerText = 'Disable 2FA';
    submitButton.classList.add('bg-red-600', 'hover-bg-red-700', 'focus:ring-red-500');
    submitButton.classList.remove('bg-blue-600', 'hover-bg-blue-700', 'focus:ring-blue-500');
  }
}

async function disable2FA(twoFAToggle: HTMLInputElement): Promise<void> {
  const tokenElement = document.getElementById('auth-code') as HTMLInputElement;
  if (!tokenElement) {
    console.log('No input field for auth code');
    return;
  }

  const passwordElement = document.getElementById('QRCode-password') as HTMLInputElement;
  if (!passwordElement) {
    console.log('No input field for QR password confirmation');
    return;
  }

  const twoFAObject = {
    code: tokenElement.value,
    password: passwordElement.value,
  };

  try {
    const response = await fetch('/api/users/2FA/disable', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(twoFAObject),
    });
    if (response.ok) twoFAToggle.checked = false;
  } catch (error) {
    console.log(`2FA disable error: ${error}`);
    return;
  }
}

async function enable2FA(twoFAToggle: HTMLInputElement): Promise<void> {
  const tokenElement = document.getElementById('auth-code') as HTMLInputElement;
  if (!tokenElement) {
    console.log('No input field for auth code');
    return;
  }

  const passwordElement = document.getElementById('QRCode-password') as HTMLInputElement;
  if (!passwordElement) {
    console.log('No input field for QR password confirmation');
    return;
  }

  const twoFAObject = {
    code: tokenElement.value,
    password: passwordElement.value,
  };

  try {
    const response = await fetch('/api/users/2FA/verify', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(twoFAObject),
    });
    if (response.ok) twoFAToggle.checked = true;
  } catch (error) {
    console.log(`2FA enable error: ${error}`);
    return;
  }
}
