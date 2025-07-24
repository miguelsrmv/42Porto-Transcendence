/**
 * @file mainMenu.ts
 * @brief Handles the setup of the main menu page.
 */

import { showMenuHelperText } from '../../ui/helperText.js';
import { userIsLoggedIn } from '../auth/auth.service.js';

/**
 * @brief Initializes view for main menu
 *
 * This function sets up the main menu, depending on if the user has logged in or not
 */
export async function initializeView() {
  // NOTE: Changed from checking login status due to speed. Possible bug?!?!
  const isLoggedIn: boolean = localStorage.getItem('ID') !== null;

  if (isLoggedIn)
    document.querySelectorAll('#main-menu-buttons a[data-target]').forEach(function (anchor) {
      showMenuHelperText(anchor);
    });
  else {
    const localPlayButton = document.getElementById('local-match-button');
    if (localPlayButton) {
      showMenuHelperText(localPlayButton);
    }
    const localTournamentButton = document.getElementById('local-tournament-button');
    if (localTournamentButton) {
      showMenuHelperText(localTournamentButton);
    }

    window.localStorage.clear();

    const disableButton = (
      buttonId: string,
      buttonContainerId: string,
      buttonContainerTextId: string,
      buttonContainerOverlayId: string,
    ) => {
      const button = document.getElementById(buttonId);
      const buttonContainer = document.getElementById(buttonContainerId);
      const buttonContainerText = document.getElementById(buttonContainerTextId);
      const buttonContainerOverlay = document.getElementById(buttonContainerOverlayId);

      if (button) {
        button.classList.remove(
          'transform',
          'transition',
          'duration-200',
          'hover:scale-105',
          'hover:shadow-2xl',
          'cursor-pointer',
        );
        button.removeAttribute('href');
        button.removeAttribute('data-target');
        button.classList.add('disabled-button');
      }
      if (buttonContainer) {
        buttonContainer.classList.remove(
          'transition-transform',
          'duration-200',
          'group-hover:scale-105',
        );
      }
      if (buttonContainerText) {
        buttonContainerText.classList.remove(
          'from-blue-700',
          'from-yellow-700',
          'from-green-700',
          'from-purple-700',
          'from-gray-700',
          'bg-gradient-to-t',
          'to-transparent',
        );
      }
      if (buttonContainerOverlay) {
        buttonContainerOverlay.classList.remove(
          'bg-blue-700',
          'bg-yellow-700',
          'bg-green-700',
          'bg-purple-700',
          'bg-gray-700',
          'transition-opacity',
          'duration-200',
          'group-hover:opacity-0',
        );
        buttonContainerOverlay.classList.add('bg-gray-700', 'opacity-75');
      }
    };

    disableButton(
      'remote-match-button',
      'remote-match-button-container',
      'remote-match-button-container-text',
      'remote-match-button-overlay',
    );
    disableButton(
      'remote-tournament-button',
      'remote-tournament-button-container',
      'remote-tournament-button-container-text',
      'remote-tournament-button-overlay',
    );
    disableButton(
      'rankings-button',
      'rankings-button-container',
      'rankings-button-container-text',
      'rankings-button-overlay',
    );
    disableButton(
      'friends-button',
      'friends-button-container',
      'friends-button-container-text',
      'friends-button-overlay',
    );
  }
}
