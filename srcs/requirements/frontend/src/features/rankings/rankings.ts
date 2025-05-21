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

  const userName = document.getElementById('user-name-rankings');
  if (!userName) {
    console.log("Couldn't find username HTML element");
    return;
  }

  const userWL = document.getElementById('user-wl-rankings');
  if (!userWL) {
    console.log("Couldn't find user WL HTML element");
    return;
  }

  const userRanking = document.getElementById('user-ranking-rankings');
  if (!userRanking) {
    console.log("Couldn't find user rankings HTML element");
    return;
  }

  const userTournaments = document.getElementById('user-tournaments-rankings');
  if (!userTournaments) {
    console.log("Couldn't find user tournament HTML element");
    return;
  }

  const userPoints = document.getElementById('user-points-rankings');
  if (!userPoints) {
    console.log("Couldn't find user points HTML element");
    return;
  }

  userName.innerText = window.localStorage.getItem('Username') as string;

  try {
    const response = await fetch(`api/users/${userId}/stats`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching user stats:', response.status);
      return;
    }
    const statsJson = await response.json();
    const stats = statsJson.stats;
    userRanking.innerText = stats.rank;
    userWL.innerText = `${stats.wins}/${stats.losses}`;
    // TODO: Change once API is available
    userTournaments.innerText = 'WAITING';
    userPoints.innerText = stats.points;

    console.dir(stats);
  } catch (error) {
    console.error('Network error fetching user stats:', error);
    return;
  }
}

function initializeBottomLeftBoard(): void {}

function initializeRightPanel(): void {}
