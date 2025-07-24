/**
 * @brief Prompts the user to confirm changes by entering a password.
 *
 * This function waits for the user to interact with a password modal
 * and returns the entered password if confirmed, or null if the modal
 * is dismissed or an error occurs during modal setup.
 *
 * @return A promise that resolves to the entered password as a string,
 *         or null if the modal is dismissed or fails to initialize.
 */
export async function confirmChanges(): Promise<string | null> {
  try {
    // waitForPasswordModal will resolve with password or reject on dismissal/error
    const password = await waitForPasswordModal();
    return password;
  } catch (error) {
    console.warn(`Password confirmation error: ${error}`);
  }
  return null;
}

/**
 * @brief Displays a password modal and waits for user interaction.
 *
 * This function handles the display of a password modal, including
 * animations, user input, and event listeners for confirmation or
 * dismissal. It resolves with the entered password or rejects if
 * the modal is dismissed or required elements are missing.
 *
 * @return A promise that resolves to the entered password as a string.
 * @throws If the modal is dismissed, required elements are missing, or other setup errors occur.
 */
function waitForPasswordModal(): Promise<string> {
  // Removed 'async' as we are returning new Promise directly
  return new Promise((resolve, reject) => {
    const passwordModal = document.getElementById('password-modal');
    const confirmButton = document.getElementById(
      'change-confirm-button',
    ) as HTMLButtonElement | null;
    const passwordInput = document.getElementById('confirm-password') as HTMLInputElement | null;

    if (!passwordModal || !confirmButton || !passwordInput) {
      reject(new Error('Missing critical modal elements. Cannot display password confirmation.'));
      return;
    }

    let isClosed = false;

    const cleanupAndClose = (action: 'resolve' | 'reject', value?: string | Error) => {
      if (isClosed) return;
      isClosed = true;

      passwordModal.removeEventListener('click', handleBackdropClick);
      confirmButton.removeEventListener('click', handleConfirmClick);

      passwordModal.classList.add('exiting');
      passwordModal.classList.remove('entering');

      const onTransitionEnd = () => {
        passwordModal.removeEventListener('transitionend', onTransitionEnd);
        passwordModal.classList.add('hidden');
        passwordInput.value = '';

        if (action === 'resolve' && typeof value === 'string') {
          resolve(value);
        } else if (action === 'reject') {
          reject(value instanceof Error ? value : new Error(String(value || 'Modal dismissed')));
        } else {
          reject(new Error('Modal closed with an invalid state.'));
        }
      };

      const computedStyle = window.getComputedStyle(passwordModal);
      if (computedStyle.transitionDuration && computedStyle.transitionDuration !== '0s') {
        passwordModal.addEventListener('transitionend', onTransitionEnd, { once: true });
      } else {
        onTransitionEnd();
      }
    };

    const handleConfirmClick = (event: MouseEvent) => {
      event.preventDefault();
      const password = passwordInput.value;
      if (!password) {
        alert('Password cannot be empty.');
        passwordInput.focus();
        return;
      }
      cleanupAndClose('resolve', password);
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === passwordModal) {
        cleanupAndClose('reject', new Error('Modal dismissed by backdrop click.'));
      }
    };

    passwordInput.value = '';
    passwordModal.classList.remove('hidden', 'exiting');
    void passwordModal.offsetWidth;
    passwordModal.classList.add('entering');

    passwordInput.focus();

    passwordModal.addEventListener('click', handleBackdropClick);
    confirmButton.addEventListener('click', handleConfirmClick);
  });
}
