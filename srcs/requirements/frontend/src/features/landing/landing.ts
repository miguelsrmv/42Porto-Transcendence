/**
 * @file landing.ts
 * @brief Handles the setup of the landing page.
 */

import { triggerLoginModal } from './loginMenu.js';
import { setLandingAnimations } from '../../ui/animations.js';
import { userIsLoggedIn } from '../auth/auth.service.js';

//let loginCheckDone: boolean = false;

/**
 * @brief Adds event listeners for the landing view.
 *
 * This function sets up the event listener for the landing button, which navigates to the home view upon click.
 */
export function initializeView(): void {
  const enterButton = document.getElementById('enter-button');

  // Adds event
  if (enterButton) {
    enterButton.addEventListener('click', async () => {
      try {
        let isLoggedIn = await userIsLoggedIn();
        /**
         * NOTE: Commented this block out because it'd cause a bug if you went backwards after logging in (it'd trigger the modal)
         *
        let isLoggedIn;
        // Checks if user is logged in or not
        if (!loginCheckDone) {
          isLoggedIn = await userIsLoggedIn();
          loginCheckDone = true;
        }
        */
        // Navigate directly to main menu if logged in
        if (isLoggedIn) {
          window.location.hash = 'main-menu-page';
          return;
        }
        // Else, trigger the modal
        else triggerLoginModal();
      } catch (error) {
        // TODO: Decide how to handle login check errors - maybe show modal anyway?
        console.error('Error checking login status:', error);
      }
    });
  } else {
    console.warn('#enter-button not found.');
  }

  setLandingAnimations();
}
