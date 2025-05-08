let passwordModalListenerAttached: boolean = false;
let passwordModalButtonListenerAttached: boolean = false;
let oldPassword: string;

export function triggerPasswordModal(): void {
  const passwordModal = document.getElementById('password-modal');
  if (!passwordModal) return;

  passwordModal.classList.remove('hidden');

  void passwordModal.offsetWidth;

  passwordModal.classList.remove('exiting');
  passwordModal.classList.add('entering');
}

export function getPasswordModalValue(): string {
  const passwordModal = document.getElementById('password-modal');
  if (!passwordModal) {
    console.log("Couldn't find password modal element");
    return '';
  }

  const passwordModalButton = document.getElementById('change-confirm-button');
  if (!passwordModalButton) {
    console.log("Couldn't find change confirm button");
    return '';
  }

  if (!passwordModalListenerAttached) {
    passwordModal.addEventListener('click', handleModalOutsideClick);
    passwordModalListenerAttached = true;
  }

  if (!passwordModalButtonListenerAttached) {
    passwordModalButton.addEventListener('click', handleModalButtonClick);
    passwordModalButtonListenerAttached = true;
  }
  return oldPassword;
}

function handleModalOutsideClick(event: MouseEvent): void {
  const passwordModal = document.getElementById('password-modal');
  if (!passwordModal) return;

  if (event.target === passwordModal) {
    closePasswordModal();
    oldPassword = '';
  }
}

function handleModalButtonClick(): void {
  const passwordContent = document.getElementById('confirm-password') as HTMLInputElement;
  oldPassword = passwordContent.value;
}

function closePasswordModal(): void {
  // No need for another console warn (already done on triggerLoginModal)
  const passwordModal = document.getElementById('password-modal');
  if (!passwordModal) return;

  // Trigger the exit transition
  passwordModal.classList.add('exiting');
  passwordModal.classList.remove('entering');

  // Remove the existing transition listener if any
  passwordModal.removeEventListener('transitionend', handleModalTransitionEnd);

  // Wait for transition to end, then hide the passwordModal
  passwordModal.addEventListener('transitionend', handleModalTransitionEnd);
}

function handleModalTransitionEnd(event: TransitionEvent): void {
  const passwordModal = document.getElementById('password-modal');
  if (!passwordModal) return;

  if (passwordModal.classList.contains('exiting')) {
    // Remove the 'exiting' class and hide the passwordModal
    passwordModal.classList.add('hidden');
    // Remove the event listener to prevent memory leaks
    passwordModal.removeEventListener('transitionend', handleModalTransitionEnd);
  }
}
