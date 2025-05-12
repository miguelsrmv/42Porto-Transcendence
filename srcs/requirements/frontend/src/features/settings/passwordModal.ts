export async function confirmChanges(): Promise<string | null> {
  try {
    const password: string = await waitForPasswordModal();
    return password;
  } catch {
    return null;
  }
}

async function waitForPasswordModal(): Promise<string> {
  return new Promise((resolve, reject) => {
    const passwordModal = document.getElementById('password-modal');
    const confirmButton = document.getElementById('change-confirm-button') as HTMLButtonElement;
    const passwordInput = document.getElementById('confirm-password') as HTMLInputElement;

    if (!passwordModal || !confirmButton || !passwordInput) {
      console.error('Missing modal elements');
      reject();
      return;
    }

    // Show modal
    passwordModal.classList.remove('hidden');
    void passwordModal.offsetWidth;
    passwordModal.classList.remove('exiting');
    passwordModal.classList.add('entering');

    // Handle transition and hide logic
    const close = () => {
      passwordModal.classList.add('exiting');
      passwordModal.classList.remove('entering');

      const onTransitionEnd = () => {
        passwordModal.classList.add('hidden');
        passwordModal.removeEventListener('transitionend', onTransitionEnd);
      };

      passwordModal.addEventListener('transitionend', onTransitionEnd, { once: true });
    };

    // Clicking outside the modal (backdrop)
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === passwordModal) {
        close();
        reject();
      }
    };

    // Clicking confirm button
    const onConfirmClick = () => {
      const password = passwordInput.value;
      if (!password) {
        console.warn('No password entered');
        return;
      }
      close();
      resolve(password);
    };

    // Add one-time listeners
    passwordModal.addEventListener('click', onBackdropClick, { once: true });
    confirmButton.addEventListener('click', onConfirmClick, { once: true });
  });
}
