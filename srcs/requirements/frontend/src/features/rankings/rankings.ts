/**
 * @file rankings.ts
 * @brief Handles the setup of the rankings page.
 */

import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { matchData } from './rankings.types.js';

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
  initializeMatchesBoard();
  initializeTournamentBoard();
}

async function initializeTopLeftBoard(): Promise<void> {
  const userId = window.localStorage.getItem('ID');

  const userAvatar = document.getElementById('user-avatar-rankings') as HTMLImageElement;
  if (!userAvatar) {
    console.log("Couldn't find user avatar HTML element");
    return;
  }

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
  userAvatar.src = window.localStorage.getItem('AvatarPath') as string;

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
  } catch (error) {
    console.error('Network error fetching user stats:', error);
    return;
  }
}

async function initializeMatchesBoard(): Promise<void> {
  const recentMatchesSection = document.getElementById('recent-matches');
  if (!recentMatchesSection) {
    console.log("Couldn't find recent matches element");
    return;
  }

  const recentMatchTemplate = document.getElementById(
    'recent-matches-template',
  ) as HTMLTemplateElement;
  if (!recentMatchTemplate) {
    console.log("Couldn't find recent matches template element");
    return;
  }

  try {
    const response = await fetch('api/matches/me', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching user response matches:', response.status);
      return;
    }
    const recentMatchesJson = await response.json();
    const recentMatchesArray = recentMatchesJson.slice(0, 3);
    recentMatchesArray.forEach(async (element: matchData) => {
      const clone = recentMatchTemplate.content.cloneNode(true) as DocumentFragment;
      await updateNodeWithRecentMatchesData(clone, element);
      recentMatchesSection.appendChild(clone);
    });
  } catch (error) {
    console.error('Network error fetching recent matches:', error);
    return;
  }
}

async function updateNodeWithRecentMatchesData(
  clone: DocumentFragment,
  recentMatch: matchData,
): Promise<void> {
  const recentMatchScoreIndicator = clone.querySelector(
    '#recent-match-score-indicator',
  ) as HTMLDivElement;
  if (!recentMatchScoreIndicator) {
    console.log("Couldn't find recent match score indicator HTML element");
    return;
  }

  const recentMatchPlayerName = clone.querySelector('#recent-match-player') as HTMLSpanElement;
  if (!recentMatchPlayerName) {
    console.log("Couldn't find recent match player HTML element");
    return;
  }

  const recentMatchResult = clone.querySelector('#recent-match-result') as HTMLSpanElement;
  if (!recentMatchResult) {
    console.log("Couldn't find recent match result HTML element");
    return;
  }
  const userId = window.localStorage.getItem('ID');
  const opponentId = recentMatch.user1Id === userId ? recentMatch.user2Id : recentMatch.user1Id;

  let opponentName;
  try {
    const response = await fetch(`api/users/${opponentId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching opponent data', response.status);
      return;
    }
    const userData = await response.json();
    recentMatchPlayerName.innerText = `vs. ${userData.username}`;
    recentMatchResult.innerText = `${recentMatch.user1Score} - ${recentMatch.user2Score}`;
  } catch (error) {
    console.error('Network error fetching opponent data', error);
    return;
  }

  const colour = userId === recentMatch.winnerId ? 'green' : 'red';
  recentMatchScoreIndicator.classList.add(`bg-${colour}-500`);
  recentMatchResult.classList.add(`text-${colour}-400`);
}

function initializeTournamentBoard(): void {}

function initializeRightPanel(): void {}
