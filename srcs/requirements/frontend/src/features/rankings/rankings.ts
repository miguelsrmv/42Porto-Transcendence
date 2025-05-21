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
  if (!checkLoginStatus()) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }
  initializeLeftPanel();
  initializeRightPanel();
}

function initializeLeftPanel(): void {
  initializeTopLeftBoard();
  initializeBottomLeftBoard();
}

async function initializeTopLeftBoard(): Promise<void> {
  const userId = window.localStorage.getItem('ID');

  try {
    const response = await fetch(`api/users/${userId}/stats`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching user stats:', response.status);
      return;
    }
    const stats = await response.json();
    console.dir(stats);
  } catch (error) {
    console.error('Network error fetching user stats:', error);
    return;
  }
}

function initializeBottomLeftBoard(): void {}

function initializeRightPanel(): void {}
