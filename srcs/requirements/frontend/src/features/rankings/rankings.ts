/**
 * @file rankings.ts
 * @brief Handles the setup of the rankings page.
 */

import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import { matchData, leaderboardData, statsData, userData } from './rankings.types.js';

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
  await initializeLeftPanel();
  await initializeRightPanel();
}

async function initializeLeftPanel(): Promise<void> {
  await initializeTopLeftBoard();
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
    const stats: statsData = statsJson.stats;
    userRanking.innerText = stats.rank.toString();
    userWL.innerText = `${stats.wins}/${stats.losses}`;
    // TODO: Change once API is available
    userTournaments.innerText = 'WAITING';
    userPoints.innerText = stats.points.toString();
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
    const recentMatchesJson: matchData[] = await response.json();
    const recentMatchesArray: matchData[] = recentMatchesJson.slice(0, 3);
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

async function initializeRightPanel(): Promise<void> {
  const rankingsList = document.getElementById('rankings-list');
  if (!rankingsList) {
    console.log("Couldn't find rankings list");
    return;
  }

  const playerTemplate = document.getElementById(
    'leaderboard-player-template',
  ) as HTMLTemplateElement;
  if (!playerTemplate) {
    console.log("Couldn't find leaderboard player template element");
    return;
  }

  try {
    const response = await fetch('api/leaderboard', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching leaderboard:', response.status);
      return;
    }
    const leaderboardJson: leaderboardData[] = await response.json();
    for (let index: number = 0; index < leaderboardJson.length; index++) {
      const clone = playerTemplate.content.cloneNode(true) as DocumentFragment;
      await updateNodeWithLeaderboardPlayer(clone, leaderboardJson[index]);
      rankingsList.appendChild(clone);
    }
  } catch (error) {
    console.error('Network error fetching leaderboard:', error);
    return;
  }

  const myId = window.localStorage.getItem('ID');
  try {
    const response = await fetch(`api/users/${myId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching my own data', response.status);
      return;
    }
    const userData: userData = await response.json();
    highlightPlayer(userData.rank, 'green');
    highlightPlayer(1, 'yellow');
  } catch (error) {
    console.error('Network error fetching opponent data', error);
    return;
  }
}

async function updateNodeWithLeaderboardPlayer(
  clone: DocumentFragment,
  element: leaderboardData,
): Promise<void> {
  const user = clone.querySelector('#leaderboard-player') as HTMLDivElement;
  if (!user) {
    console.log("Couldn't find player");
    return;
  }

  const userAvatar = clone.querySelector('#leaderboard-player-avatar') as HTMLImageElement;
  if (!userAvatar) {
    console.log("Couldn't find avatar");
    return;
  }

  const userRank = clone.querySelector('#leaderboard-player-ranking') as HTMLSpanElement;
  if (!userRank) {
    console.log("Couldn't find leaderboard rank element");
    return;
  }

  const userName = clone.querySelector('#leaderboard-player-username') as HTMLSpanElement;
  if (!userName) {
    console.log("Couldn't find leaderboard username element");
    return;
  }

  const userPoints = clone.querySelector('#leaderboard-player-points') as HTMLDivElement;
  if (!userPoints) {
    console.log("Couldn't find leaderboard points element");
    return;
  }

  const userWL = clone.querySelector('#leaderboard-player-wl') as HTMLDivElement;
  if (!userWL) {
    console.log("Couldn't find leaderboard leaderboard wl element");
    return;
  }

  const userTournamentsWon = clone.querySelector(
    '#leaderboard-player-tournaments-won',
  ) as HTMLDivElement;
  if (!userTournamentsWon) {
    console.log("Couldn't find leaderboard leaderboard tournamentsWon element");
    return;
  }

  try {
    const statsResponse = await fetch(`api/users/${element.userId}/stats`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!statsResponse.ok) {
      console.error('Error fetching user stats:', statsResponse.status);
      return;
    }
    const statsJson = await statsResponse.json();
    const stats: statsData = statsJson.stats;
    userRank.innerText = `#${stats.rank}`;
    userWL.innerText = `${stats.wins}/${stats.losses}`;
    // TODO: Change once API is available
    userTournamentsWon.innerText = 'WAITING';
    userPoints.innerText = stats.points.toString();
    user.setAttribute('data-ranking', stats.rank.toString());

    const userDataResponse = await fetch(`api/users/${element.userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!userDataResponse.ok) {
      console.error('Error fetching username:', userDataResponse.status);
      return;
    }

    const userData = await userDataResponse.json();
    userName.innerText = userData.username;
    userAvatar.src = userData.avatarUrl;
    console.log('UserData', userData);
    console.log('Stats Data', stats);
  } catch (error) {
    console.error('Network error fetching user stats:', error);
    return;
  }
}

function highlightPlayer(rank: number, colour: string): void {
  const targetPlayer = document.querySelector(`[data-ranking="${rank}"]`);
  if (!targetPlayer) {
    console.log('Target player not found', rank);
    return;
  }

  const targetPlayerRanking = targetPlayer.querySelector('#leaderboard-player-ranking');
  if (!targetPlayerRanking) {
    console.log('Target player ranking not found');
    return;
  }

  const targetPlayerCircle = targetPlayer.querySelector('#leaderboard-player-round-circle');
  if (!targetPlayerCircle) {
    console.log('Target player circle spot not found');
    return;
  }

  targetPlayer.classList.add('bg-gradient-to-r', `from-${colour}-900/30`, 'to-transparent');
  targetPlayerRanking.classList.remove('border-gray-600', 'text-white');
  targetPlayerRanking.classList.add(`bg-${colour}-500/20`, `text-${colour}-300`);
  targetPlayerCircle.classList.remove('border-gray-400');
  targetPlayerCircle.classList.add(`border-${colour}-400`);
}

// TODO: Replace for each by proper for loops
// TODO: Update leaderboard avatars
// TODO: Search bar
// TODO: Make usernames clickable
// TODO: Edit colours appropriately
