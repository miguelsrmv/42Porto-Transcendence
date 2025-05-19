/**
 * @brief Prompts the user to confirm changes by entering a password.
 *
 * This function waits for the user to interact with a password modal
 * and returns the entered password if confirmed, or null if the modal
 * is dismissed.
 *
 * @return A promise that resolves to the entered password as a string,
 *         or null if the modal is dismissed.
 */
export async function confirmChanges(): Promise<string | null> {
  try {
    const password: string = await waitForPasswordModal();
    return password;
  } catch {
    return null;
  }
}

/**
 * @brief Displays a password modal and waits for user interaction.
 *
 * This function handles the display of a password modal, including
 * animations, user input, and event listeners for confirmation or
 * dismissal. It resolves with the entered password or rejects if
 * the modal is dismissed.
 *
 * @return A promise that resolves to the entered password as a string.
 * @throws If the modal is dismissed or required elements are missing.
 */
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
