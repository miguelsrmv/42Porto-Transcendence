/**
 * @file friends.ts
 * @brief Handles the setup of the friends page.
 */

import { checkLoginStatus } from '../../utils/helpers';
import { navigate } from '../../core/router';

/**
 * @brief Initializes view for friends
 *
 * This function sets up the view for friends
 */
export async function initializeView(): Promise<void> {
  if (!checkLoginStatus()) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }
}
