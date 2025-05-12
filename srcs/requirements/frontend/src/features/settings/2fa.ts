import { twoFAErrorMessages } from '../../constants/errorMessages.js';

// --- Centralized DOM Element Getters ---
function getElements() {
  const twoFAtoggle = document.getElementById('2fa-toggle-input') as HTMLInputElement | null;
  const twoFAmodal = document.getElementById('twoFA-modal') as HTMLElement | null;
  const confirmButton = document.getElementById('twoFA-button') as HTMLButtonElement | null;
  const cancelButton = document.getElementById('twoFA-cancel') as HTMLButtonElement | null;
  const headerText = document.getElementById('qr-modal-header') as HTMLElement | null;
  const qrCodeImage = document.getElementById('QR-code') as HTMLImageElement | null;
  const tokenElement = document.getElementById('auth-code') as HTMLInputElement | null;
  const passwordElement = document.getElementById('QRCode-password') as HTMLInputElement | null;
  const errorContainer = document.getElementById('error-2fa-message') as HTMLElement | null;
  const form = document.getElementById('QRCode-form') as HTMLFormElement | null;
  const closeModalButton = document.getElementById('close-modal-btn') as HTMLButtonElement | null;

  return {
    twoFAtoggle,
    twoFAmodal,
    confirmButton,
    cancelButton,
    headerText,
    qrCodeImage,
    tokenElement,
    passwordElement,
    errorContainer,
    form,
    closeModalButton,
  };
}

// --- Modal Error Handling ---
function showModalError(messageKey: string | undefined, customMessage?: string) {
  const { errorContainer } = getElements();
  if (errorContainer) {
    errorContainer.classList.remove('hidden');
    if (customMessage) {
      errorContainer.innerText = customMessage;
    } else if (messageKey && twoFAErrorMessages[messageKey]) {
      errorContainer.innerText = twoFAErrorMessages[messageKey];
    } else {
      errorContainer.innerText = 'An unexpected error occurred.';
    }
  }
}

function clearModalError() {
  const { errorContainer } = getElements();
  if (errorContainer) {
    errorContainer.innerText = '';
    errorContainer.classList.add('hidden');
  }
}

function clear2FAModalInputsAndErrors(): void {
  const { form, tokenElement, passwordElement } = getElements();
  if (form) {
    form.reset(); // Clears input fields within the form
  } else {
    // Fallback if no form element or specific fields
    if (tokenElement) tokenElement.value = '';
    if (passwordElement) passwordElement.value = '';
  }
  clearModalError();
}

// --- 2FA Status API ---
async function fetchNormalised2FAStatus(): Promise<boolean | undefined> {
  try {
    const response = await fetch('/api/users/2FA/check', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching 2FA status:', response.status);
      alert('Error fetching 2FA status: please try again later!');
      return undefined;
    }
    const apiResponseIs2FAOff = await response.json();
    return !apiResponseIs2FAOff; // Invert to get actual enabled status
  } catch (error) {
    console.error('Network error fetching 2FA status:', error);
    alert('Network error fetching 2FA status. Please check your connection.');
    return undefined;
  }
}

export async function reset2FAToggleVisuals(): Promise<void> {
  const { twoFAtoggle } = getElements();
  if (!twoFAtoggle) {
    console.log('No 2 Factor Auth toggle found for reset');
    return;
  }

  const is2FAActuallyEnabled = await fetchNormalised2FAStatus();

  if (is2FAActuallyEnabled === undefined) {
    console.warn('Could not determine 2FA status to reset toggle.');
    return;
  }

  // Set the toggle to match the actual server status
  twoFAtoggle.checked = is2FAActuallyEnabled;
}

let isModalAnimating = false;
let currentCloseModalTransitionEndHandler: ((event: TransitionEvent) => void) | null = null;
let currentCloseModalTimeoutId: ReturnType<typeof setTimeout> | null = null;

function closeModal(): void {
  const { twoFAmodal } = getElements(); // Get fresh DOM elements each call
  if (!twoFAmodal || isModalAnimating || twoFAmodal.classList.contains('hidden')) {
    return;
  }

  isModalAnimating = true;

  // Clean up any listeners/timeouts from a *previous, potentially interrupted* closeModal call
  // This is defensive programming.
  if (currentCloseModalTransitionEndHandler) {
    twoFAmodal.removeEventListener('transitionend', currentCloseModalTransitionEndHandler);
  }
  if (currentCloseModalTimeoutId) {
    clearTimeout(currentCloseModalTimeoutId);
  }

  // Add exiting class to trigger transition
  twoFAmodal.classList.add('exiting');
  twoFAmodal.classList.remove('entering'); // Ensure 'entering' is not present

  // Define the handler function so we have a reference to remove it
  const transitionEndHandler = (event: TransitionEvent) => {
    // Ensure the event is for the modal itself and not a child element's transition
    if (event.target === twoFAmodal) {
      if (currentCloseModalTimeoutId) {
        clearTimeout(currentCloseModalTimeoutId); // Clear the fallback timeout
        currentCloseModalTimeoutId = null;
      }

      twoFAmodal.classList.add('hidden');
      isModalAnimating = false;

      // Remove this specific listener instance
      twoFAmodal.removeEventListener('transitionend', transitionEndHandler);
      currentCloseModalTransitionEndHandler = null; // Clear the stored reference
    }
  };
  currentCloseModalTransitionEndHandler = transitionEndHandler; // Store reference

  // Set a timeout as a fallback
  currentCloseModalTimeoutId = setTimeout(() => {
    // Timeout fired, meaning transitionend didn't (or was too slow)
    // We MUST remove the listener to prevent it firing on a future transition
    if (currentCloseModalTransitionEndHandler) {
      // Check if a handler was indeed set
      twoFAmodal.removeEventListener('transitionend', currentCloseModalTransitionEndHandler);
      currentCloseModalTransitionEndHandler = null;
    }

    if (!twoFAmodal.classList.contains('hidden')) {
      // Check to prevent redundant actions
      twoFAmodal.classList.add('hidden');
    }
    isModalAnimating = false;
    currentCloseModalTimeoutId = null; // Clear the stored reference
  }, 300); // Adjust based on your transition duration

  // Add the event listener (no longer using { once: true } as we manage removal manually)
  twoFAmodal.addEventListener('transitionend', currentCloseModalTransitionEndHandler);
}

function openModal(): void {
  const { twoFAmodal } = getElements();
  if (!twoFAmodal || isModalAnimating || !twoFAmodal.classList.contains('hidden')) return;

  isModalAnimating = true;

  // Remove hidden class first
  twoFAmodal.classList.remove('hidden');

  // Force a reflow to ensure transition happens
  void twoFAmodal.offsetWidth;

  // Set transition classes
  twoFAmodal.classList.remove('exiting');
  twoFAmodal.classList.add('entering');

  // Set a timeout to clear animating state
  setTimeout(() => {
    isModalAnimating = false;
  }, 300); // Match your CSS transition duration
}

// --- Event Handlers ---
// We'll use a different approach to handle modal closing
async function handleCloseModal(): Promise<void> {
  closeModal();
  await reset2FAToggleVisuals(); // Always reset toggle to actual state when closing
}

// Background click handler
function handleBackdropClick(event: MouseEvent): void {
  const { twoFAmodal } = getElements();
  if (!twoFAmodal) return;

  // Only proceed if click was directly on the modal backdrop (not content)
  if (event.target === twoFAmodal) {
    event.preventDefault();
    event.stopPropagation();
    handleCloseModal();
  }
}

// Handle confirm button click
async function handleConfirmClick(): Promise<void> {
  const { twoFAtoggle } = getElements();
  if (!twoFAtoggle) {
    console.error('No 2 Factor Auth toggle found in handleConfirmClick');
    return;
  }

  // The toggle's `checked` state reflects the user's intended action
  let success = false;
  const twoFAstatus = !fetchNormalised2FAStatus();
  if (!twoFAstatus) {
    // User intends to enable 2FA
    success = await enable2FA();
  } else {
    // User intends to disable 2FA
    success = await disable2FA();
  }

  if (success) {
    closeModal();
  } else {
    console.error('2FA operation failed');
    // Error is already displayed in modal
  }
}

// --- Setup Function ---
let isEventSetupComplete = false;

export function handle2FA(): void {
  const elements = getElements();
  const { twoFAtoggle, twoFAmodal, confirmButton, cancelButton, closeModalButton } = elements;

  if (!twoFAtoggle) {
    console.log('No 2 Factor Auth toggle found for handle2FA');
    return;
  }
  if (!twoFAmodal) {
    console.log('No 2 Factor Auth modal found');
    return;
  }

  // Only set up event listeners once
  if (isEventSetupComplete) {
    return;
  }

  // Set up toggle click handler
  twoFAtoggle.addEventListener('click', async (e) => {
    e.stopPropagation();
    openModal();
    await toggleQRModalView(twoFAtoggle.checked);
  });

  // Handle modal backdrop clicks (only direct clicks on backdrop)
  twoFAmodal.addEventListener('click', (e: Event) => {
    handleBackdropClick(e as MouseEvent);
  });

  // Confirm button
  if (confirmButton) {
    confirmButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent bubbling
      handleConfirmClick();
    });
  }

  // Cancel button (if it exists)
  if (cancelButton) {
    cancelButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent bubbling
      handleCloseModal();
    });
  }

  // Close button (if it exists)
  if (closeModalButton) {
    closeModalButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent bubbling
      handleCloseModal();
    });
  }

  isEventSetupComplete = true;
}

// --- Toggle UI Between Enable/Disable Mode ---
async function toggleQRModalView(intendingToEnable: boolean): Promise<void> {
  const { headerText, qrCodeImage, confirmButton } = getElements();

  if (!headerText || !qrCodeImage || !confirmButton) {
    console.error('Modal elements for QR view not found.');
    return;
  }

  confirmButton.focus();

  clear2FAModalInputsAndErrors();

  if (intendingToEnable) {
    headerText.innerText = 'Scan this QR code with your Authenticator app';
    confirmButton.innerText = 'Verify Code';
    confirmButton.classList.add('bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500');
    confirmButton.classList.remove('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
    qrCodeImage.src = '';
    qrCodeImage.alt = 'Loading QR Code...';
    qrCodeImage.classList.remove('hidden');

    try {
      const response = await fetch('/api/users/2FA/setup', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'SETUP_REQUEST_FAILED' }));
        showModalError(
          errorData.message,
          !twoFAErrorMessages[errorData.message] ? 'Failed to load QR code.' : undefined,
        );
        qrCodeImage.classList.add('hidden');
        return;
      }
      const URI = await response.text();
      qrCodeImage.src = URI;
      qrCodeImage.alt = '2FA QR Code';
    } catch (error) {
      console.error(`QR Code get error: ${error}`);
      showModalError(undefined, 'Network error while fetching QR code.');
      qrCodeImage.classList.add('hidden');
    }
  } else {
    // User wants to disable 2FA
    headerText.innerText = 'Enter authenticator code and password to disable 2FA';
    qrCodeImage.classList.add('hidden');
    confirmButton.innerText = 'Disable 2FA';
    confirmButton.classList.add('bg-red-600', 'hover:bg-red-700', 'focus:ring-red-500');
    confirmButton.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'focus:ring-blue-500');
  }

  confirmButton.focus();
}

// --- API Interactions ---
/**
 * Attempts to disable 2FA.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
async function disable2FA(): Promise<boolean> {
  const { tokenElement, passwordElement, twoFAtoggle } = getElements();
  if (!tokenElement || !passwordElement || !twoFAtoggle) {
    console.error('Required elements for disable2FA not found.');
    showModalError(undefined, 'Client error: form elements missing.');
    return false;
  }

  const twoFAObject = {
    code: tokenElement.value,
    password: passwordElement.value,
  };

  clearModalError();

  try {
    const response = await fetch('/api/users/2FA/disable', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(twoFAObject),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'DISABLE_REQUEST_FAILED' }));
      console.error('2FA disable API error:', response.status, errorData);
      showModalError(
        errorData.message,
        !twoFAErrorMessages[errorData.message]
          ? `Failed to disable 2FA (${response.status}).`
          : undefined,
      );
      await reset2FAToggleVisuals(); // Revert toggle to actual server state
      return false;
    }
    twoFAtoggle.checked = false;
    clear2FAModalInputsAndErrors();
    return true;
  } catch (error) {
    console.error(`2FA disable network/js error: ${error}`);
    showModalError(undefined, 'Network error during 2FA disable.');
    await reset2FAToggleVisuals(); // Revert toggle
    return false;
  }
}

/**
 * Attempts to enable (verify) 2FA.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
async function enable2FA(): Promise<boolean> {
  const { tokenElement, passwordElement, twoFAtoggle } = getElements();
  if (!tokenElement || !passwordElement || !twoFAtoggle) {
    console.error('Required elements for enable2FA not found.');
    showModalError(undefined, 'Client error: form elements missing.');
    return false;
  }

  const twoFAObject = {
    code: tokenElement.value,
    password: passwordElement.value,
  };

  clearModalError();

  try {
    const response = await fetch('/api/users/2FA/verify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(twoFAObject),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'VERIFY_REQUEST_FAILED' }));
      console.error('2FA enable/verify API error:', response.status, errorData);
      showModalError(
        errorData.message,
        !twoFAErrorMessages[errorData.message]
          ? `Failed to enable 2FA (${response.status}).`
          : undefined,
      );
      await reset2FAToggleVisuals();
      return false;
    }
    twoFAtoggle.checked = true;
    clear2FAModalInputsAndErrors();
    return true;
  } catch (error) {
    console.error(`2FA enable network/js error: ${error}`);
    showModalError(undefined, 'Network error during 2FA enable.');
    await reset2FAToggleVisuals(); // Revert toggle
    return false;
  }
}

//TODO: Display error messages on modal
//NOTE: David, issues I found:
/// Should the opposite of /api/users/2fa/disable be /api/users/2fa/enable instead of verify?
/// Both should be Post requests and take this object? { code: tokenElement.value, password: passwordElement.value };
/// Am I getting the correct bool from fetch2FAstatus()? (see line 72)
