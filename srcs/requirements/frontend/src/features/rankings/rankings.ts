/**
 * @file rankings.ts
 * @brief Handles the setup of the rankings page.
 */

import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';

/**
 * @brief Initializes view for rankings
 *
 * This function sets up the view for rankings
 */
export async function initializeView(): Promise<void> {
  if (!(await checkLoginStatus())) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }
}
