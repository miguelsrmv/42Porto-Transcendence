/**
 * @file rankings.ts
 * @brief Handles the setup of the rankings page.
 */

import { checkLoginStatus } from '../../utils/helpers.js';
import { navigate } from '../../core/router.js';
import {
  matchData,
  tournamentData,
  leaderboardData,
  statsData,
  userData,
} from './rankings.types.js';
import { tournamentPlayer } from '../../ui/tournamentStatus/tournamentStatus.types.js';
import { showTournamentResults } from '../../ui/tournamentStatus/tournamentStatus.js';
import { fadeIn, fadeOut } from '../../ui/animations.js';
import { wait } from '../../utils/helpers.js';
import {
  getCharacterPathFromBackend,
  getAccentColourFromBackend,
} from '../game/characterData/characterData.js';

/**
 * @brief Initializes the view for the rankings page.
 *
 * This function checks the login status, sets up the left and right panels,
 * and initializes leaderboard-related functionality.
 */
export async function initializeView(): Promise<void> {
  if (!checkLoginStatus()) {
    alert('You need to be logged in to access this page');
    navigate('landing-page');
    return;
  }

  const userId = window.localStorage.getItem('ID') as string;

  await renderLeftPanel(userId);
  await initializeRightPanel();
  setupLeaderboardSearch();
  setupLeaderboardClick();
}

/**
 * @brief Renders the left panel of the rankings page.
 *
 * @param userId The ID of the user whose data will be displayed.
 */
async function renderLeftPanel(userId: string): Promise<void> {
  cleanLeftPanel();
  await renderTopLeftBoard(userId);
  await renderMatchesBoard(userId);
  await renderTournamentBoard(userId);
}

/**
 * @brief Renders the top-left board with user information.
 *
 * @param userId The ID of the user whose data will be fetched and displayed.
 */
async function renderTopLeftBoard(userId: string): Promise<void> {
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
    const userProfileResponse = await fetch(`api/users/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!userProfileResponse.ok) {
      console.error('Error fetching uder profile data:', userProfileResponse.status);
      return;
    }
    const userProfileJson = await userProfileResponse.json();

    userName.innerText = userProfileJson.username;
    userAvatar.src = userProfileJson.avatarUrl;

    const statsResponse = await fetch(`api/users/${userId}/stats`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!statsResponse.ok) {
      console.error('Error fetching user stats:', statsResponse.status);
      return;
    }
    const statsJson = await statsResponse.json();
    const stats: statsData = statsJson.stats;
    userRanking.innerText = stats.rank.toString();
    userWL.innerText = `${stats.wins}/${stats.losses}`;
    userTournaments.innerText = stats.tournaments.toString();
    userPoints.innerText = stats.points.toString();
  } catch (error) {
    console.error('Network error fetching user stats:', error);
    return;
  }
}

/**
 * @brief Renders the recent matches board.
 *
 * @param userId The ID of the user whose recent matches will be displayed.
 */
async function renderMatchesBoard(userId: string): Promise<void> {
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
    const response = await fetch(`api/matches/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching user response matches:', response.status);
      return;
    }
    const recentMatchesArray: matchData[] = await response.json();
    for (let index: number = 0; index < 3 && index < recentMatchesArray.length; index++) {
      const clone = recentMatchTemplate.content.cloneNode(true) as DocumentFragment;
      await updateNodeWithRecentMatchesData(clone, recentMatchesArray[index]);
      const match = clone.querySelector('.recent-match') as HTMLElement;
      if (!match) return;
      match.setAttribute('data-id', recentMatchesArray[index].id);
      recentMatchesSection.appendChild(clone);
    }
  } catch (error) {
    console.error('Network error fetching recent matches:', error);
    return;
  }

  addMatchModal();
}

/**
 * @brief Updates a DOM node with recent match data.
 *
 * @param clone The DOM fragment to update.
 * @param recentMatch The data of the recent match to display.
 */
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

/**
 * @brief Renders the tournament board.
 *
 * @param userId The ID of the user whose tournament data will be displayed.
 */
async function renderTournamentBoard(userId: string): Promise<void> {
  const recentTournamentSection = document.getElementById('recent-tournaments');
  if (!recentTournamentSection) {
    console.log("Couldn't find recent tournaments element");
    return;
  }

  const recentTournamentTemplate = document.getElementById(
    'recent-tournaments-template',
  ) as HTMLTemplateElement;
  if (!recentTournamentTemplate) {
    console.log("Couldn't find recent matches template element");
    return;
  }

  try {
    const response = await fetch(`api/tournaments/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching user response matches:', response.status);
      return;
    }
    const recentTournamentsArray: tournamentData[] = await response.json();
    for (let index: number = 0; index < 3 && index < recentTournamentsArray.length; index++) {
      const clone = recentTournamentTemplate.content.cloneNode(true) as DocumentFragment;
      await updateNodeWithRecentTournamentData(clone, recentTournamentsArray[index]);
      const tournament = clone.querySelector('.recent-tournament') as HTMLElement;
      if (!tournament) return;
      tournament.setAttribute('data-id', recentTournamentsArray[index].tournamentId);
      recentTournamentSection.appendChild(clone);
    }
  } catch (error) {
    console.error('Network error fetching recent matches:', error);
    return;
  }

  addTournamentModal();
}

/**
 * @brief Adds event listeners to recent tournament elements to open a modal and display tournament data.
 *
 * This function selects all elements with the class 'recent-tournament' and attaches click event listeners to them.
 * When clicked, the modal for the tournament is opened, and the tournament data is displayed based on the element's data-id attribute.
 *
 * @note If no elements with the class 'recent-tournament' are found, a message is logged to the console.
 *
 * @returns void
 */
function addMatchModal(): void {
  const recentMatches = document.querySelectorAll('.recent-match');
  if (!recentMatches) {
    console.log("Couldn't find recent matches");
    return;
  }

  for (let index: number = 0; index < recentMatches.length; index++) {
    recentMatches[index].addEventListener('click', async () => {
      const id = recentMatches[index].getAttribute('data-id') as string;
      openStatsModal();
      await displayMatchData(id);
    });
  }
}

async function displayMatchData(id: string): Promise<void> {
  try {
    const response = await fetch(`api/matches/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching matchData:', response.status);
      return;
    }
    const matchData: any = await response.json();
    console.log('Match data: ', matchData);
    openStatsModal();
    showMatchResults(matchData);
  } catch (error) {
    console.error('Network error fetching recent match:', error);
    return;
  }
}

function showMatchResults(matchData: matchData): void {
  const matchBlock = document.getElementById('match-stats') as HTMLTemplateElement;
  if (!matchBlock) {
    console.log("Couldn't find matchBlock");
    return;
  }

  const clone = matchBlock.content.cloneNode(true) as DocumentFragment;

  editHUD(clone, matchData, 'left');
  editHUD(clone, matchData, 'right');
  editStats(clone, matchData);

  const statsResults = document.getElementById('stats-results') as HTMLDivElement;
  if (!statsResults) {
    console.log("Couldn't find stats results");
    return;
  }

  statsResults.appendChild(clone);
}

function editHUD(clone: DocumentFragment, matchData: matchData, side: string): void {
  const playerAvatar = clone.querySelector(
    `.${side}-match-stats-player-avatar`,
  ) as HTMLImageElement;
  if (!playerAvatar) {
    console.log(`Couldn't find ${side}-match-stats-player-avatar`);
    return;
  }

  const playerAlias = clone.querySelector(`.${side}-match-stats-alias`) as HTMLParagraphElement;
  if (!playerAlias) {
    console.log(`Couldn't find ${side}-match-stats-alias`);
    return;
  }

  const playerPortrait = clone.querySelector(`.${side}-match-stats-portrait`) as HTMLImageElement;
  if (!playerPortrait) {
    console.log(`Couldn't find .${side}-match-stats-portrait`);
    return;
  }

  const matchSettings = JSON.parse(matchData.settings);
  let alias;
  side === 'left' ? (alias = matchSettings.alias1) : (alias = matchSettings.alias2);
  playerAlias.innerText = alias;

  let userId;
  side === 'left' ? (userId = matchData.user1Id) : (userId = matchData.user2Id);

  let userCharacter;
  side === 'left'
    ? (userCharacter = matchData.user1Character)
    : (userCharacter = matchData.user2Character);

  playerPortrait.src = getCharacterPathFromBackend(userCharacter);

  // TODO: Accent colour, avatar, hide character if not crazy
}

function editStats(clone: DocumentFragment, matchData: matchData): void {}

/**
 * @brief Adds event listeners to recent tournament elements to open a modal and display tournament data.
 *
 * This function selects all elements with the class 'recent-tournament' and attaches click event listeners to them.
 * When clicked, the modal for the tournament is opened, and the tournament data is displayed based on the element's data-id attribute.
 *
 * @note If no elements with the class 'recent-tournament' are found, a message is logged to the console.
 *
 * @returns void
 */
function addTournamentModal(): void {
  const recentTournaments = document.querySelectorAll('.recent-tournament');
  if (!recentTournaments) {
    console.log("Couldn't find recent tournaments");
    return;
  }

  for (let index: number = 0; index < recentTournaments.length; index++) {
    recentTournaments[index].addEventListener('click', async () => {
      const uuid = recentTournaments[index].getAttribute('data-id') as string;
      openStatsModal();
      await displayTournamentData(uuid);
    });
  }
}

/**
 * @brief Fetches tournament data based on a given UUID and displays it.
 *
 * This function sends a GET request to the tournament API endpoint to retrieve
 * tournament data. If the request fails or encounters a network error, it logs
 * the error and exits. Currently, it uses mock data for displaying tournament results.
 *
 * @param uuid The unique identifier of the tournament to fetch.
 * @return void This function does not return any value.
 */
async function displayTournamentData(uuid: string): Promise<void> {
  try {
    const response = await fetch(`api/tournaments/${uuid}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Error fetching tournament:', response.status);
      return;
    }
    const tournamentData: tournamentPlayer[] = await response.json();
    openStatsModal();
    showTournamentResults(tournamentData);
  } catch (error) {
    console.error('Network error fetching recent tournament:', error);
    return;
  }
}

/**
 * Handles the click event on the modal backdrop. If the click is directly on the modal backdrop,
 * the modal is hidden.
 *
 * @param {MouseEvent} event - The mouse event triggered by the click.
 * @returns {Promise<void>} Resolves when the modal hiding process is complete.
 */
async function handleModalBackdropClick(event: MouseEvent): Promise<void> {
  const statsModal = document.getElementById('stats-modal');
  if (!statsModal) {
    console.log("Couldn't find stats modal element");
    return;
  }
  // Ensure tournamentModal exists and the click was directly on it
  if (statsModal && event.target === statsModal) {
    await hideStatsModal();
  }
}

/**
 * Opens the tournament modal by fading it in and attaching a click event listener
 * to handle backdrop clicks.
 *
 * @returns {void}
 */
function openStatsModal(): void {
  const statsModal = document.getElementById('stats-modal');
  if (!statsModal) {
    console.log("Couldn't find stats modal element");
    return;
  }

  fadeIn(statsModal);
  statsModal.addEventListener('click', handleModalBackdropClick);
}

/**
 * Hides the tournament modal by fading it out, removing the backdrop click listener,
 * clearing the tournament results, and waiting for the fade-out animation to complete.
 *
 * @returns {Promise<void>} Resolves when the modal hiding process is complete.
 */
async function hideStatsModal(): Promise<void> {
  const statsModal = document.getElementById('stats-modal');
  if (!statsModal) {
    console.log("Couldn't find stats modal element");
    return;
  }

  const statsResults = document.getElementById('stats-results');
  if (!statsResults) {
    console.log("Couldn't find tournament results element");
    return;
  }

  statsModal.removeEventListener('click', handleModalBackdropClick);
  fadeOut(statsModal);
  await wait(0.5);
  statsResults.innerHTML = '';
}

/**
 * @brief Updates a DOM node with recent match data.
 *
 * @param clone The DOM fragment to update.
 * @param recentMatch The data of the recent match to display.
 */
async function updateNodeWithRecentTournamentData(
  clone: DocumentFragment,
  recentTournament: tournamentData,
): Promise<void> {
  const recentTournamentScoreIndicator = clone.querySelector(
    '#recent-tournament-score-indicator',
  ) as HTMLDivElement;
  if (!recentTournamentScoreIndicator) {
    console.log("Couldn't find recent tournament score indicator HTML element");
    return;
  }

  const recentTournamentID = clone.querySelector('#recent-tournament-id') as HTMLSpanElement;
  if (!recentTournamentID) {
    console.log("Couldn't find recent tournament ID HTML element");
    return;
  }

  const recentTournamentResult = clone.querySelector(
    '#recent-tournament-result',
  ) as HTMLSpanElement;
  if (!recentTournamentResult) {
    console.log("Couldn't find recent tournament result HTML element");
    return;
  }

  recentTournamentID.innerText = `#${recentTournament.tournamentId.split('-')[0]}`;
  recentTournamentResult.innerText = recentTournament.position;

  const colour = recentTournament.position === 'Tournament Winner!' ? 'green' : 'red';
  recentTournamentResult.classList.add(`text-${colour}-400`);
  recentTournamentScoreIndicator.classList.add(`bg-${colour}-500`);
}

/**
 * @brief Initializes the right panel of the rankings page.
 *
 * This function fetches leaderboard data and highlights specific players.
 */
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
    highlightCurrentPlayer();
    highlightBestPlayers();
  } catch (error) {
    console.error('Network error fetching opponent data', error);
    return;
  }
}

/**
 * @brief Updates a DOM node with leaderboard player data.
 *
 * @param clone The DOM fragment to update.
 * @param element The leaderboard data to display.
 */
async function updateNodeWithLeaderboardPlayer(
  clone: DocumentFragment,
  element: leaderboardData,
): Promise<void> {
  const user = clone.querySelector('.leaderboard-player') as HTMLDivElement;
  if (!user) {
    console.log("Couldn't find player");
    return;
  }

  const userAvatar = clone.querySelector('.leaderboard-player-avatar') as HTMLImageElement;
  if (!userAvatar) {
    console.log("Couldn't find avatar");
    return;
  }

  const userRank = clone.querySelector('.leaderboard-player-ranking') as HTMLSpanElement;
  if (!userRank) {
    console.log("Couldn't find leaderboard rank element");
    return;
  }

  const userName = clone.querySelector('.leaderboard-player-username') as HTMLSpanElement;
  if (!userName) {
    console.log("Couldn't find leaderboard username element");
    return;
  }

  const userPoints = clone.querySelector('.leaderboard-player-points') as HTMLDivElement;
  if (!userPoints) {
    console.log("Couldn't find leaderboard points element");
    return;
  }

  const userWL = clone.querySelector('.leaderboard-player-wl') as HTMLDivElement;
  if (!userWL) {
    console.log("Couldn't find leaderboard leaderboard wl element");
    return;
  }

  const userTournamentsWon = clone.querySelector(
    '.leaderboard-player-tournaments-won',
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
    userTournamentsWon.innerText = stats.tournaments.toString();
    userPoints.innerText = stats.points.toString();
    user.setAttribute('data-ranking', stats.rank.toString());
    user.setAttribute('data-user-id', element.userId.toString());

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
  } catch (error) {
    console.error('Network error fetching user stats:', error);
    return;
  }
}

/**
 * @brief Highlights the current player in the UI.
 *
 * Retrieves the current user's ID from local storage, finds the corresponding player element,
 * and applies a green highlight to it.
 */
function highlightCurrentPlayer(): void {
  const userId = window.localStorage.getItem('ID') as string;

  const targetPlayer = document.querySelector(`[data-user-id="${userId}"]`) as HTMLElement;

  highlightPlayer(targetPlayer, 'green');
}

/**
 * @brief Highlights all players with the top ranking.
 *
 * Finds all player elements with a ranking of 1 and applies a yellow highlight to each.
 * Logs a message if no such players are found.
 */
function highlightBestPlayers(): void {
  const targetPlayers = document.querySelectorAll(`[data-ranking="1"]`);
  if (targetPlayers.length == 0) {
    console.log('Target player not found');
    return;
  }

  targetPlayers.forEach((element) => highlightPlayer(element as HTMLElement, 'yellow'));
}

/**
 * @brief Highlights a player in the leaderboard.
 *
 * @param rank The rank of the player to highlight.
 * @param colour The color to use for highlighting.
 */
function highlightPlayer(targetPlayer: HTMLElement, colour: string): void {
  const targetPlayerRanking = targetPlayer.querySelector('.leaderboard-player-ranking');
  if (!targetPlayerRanking) {
    console.log('Target player ranking not found');
    return;
  }

  const targetPlayerCircle = targetPlayer.querySelector('.leaderboard-player-round-circle');
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

/**
 *
 * @brief Sets up the leaderboard search functionality.
 *
 * Filters the leaderboard based on user input.
 */
function setupLeaderboardSearch(): void {
  const searchInput = document.getElementById('leaderboard-search') as HTMLInputElement;
  if (!searchInput) {
    console.log('Leaderboard Search element not found');
    return;
  }
  const rankingsList = document.getElementById('rankings-list');
  if (!rankingsList) {
    console.log('Rankings list not found');
    return;
  }

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const players = rankingsList.querySelectorAll('.leaderboard-player');

    players.forEach((player) => {
      const nameElem = player.querySelector('.leaderboard-player-username');
      if (!nameElem) return;

      const name = nameElem.textContent?.toLowerCase() || '';
      if (name.includes(searchTerm)) {
        (player as HTMLElement).style.display = '';
      } else {
        (player as HTMLElement).style.display = 'none';
      }
    });
  });
}

/**
 * @brief Sets up click functionality for leaderboard players.
 *
 * Clicking on a player updates the left panel with their data.
 */
function setupLeaderboardClick(): void {
  const leaderboardList = document.getElementById('rankings-list');
  if (!leaderboardList) {
    console.log("Couldn't find leaderbost list element");
    return;
  }

  leaderboardList.addEventListener('click', (event: MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    const playerRowElement = clickedElement.closest<HTMLDivElement>('.leaderboard-player');

    if (playerRowElement) {
      const userId = playerRowElement.getAttribute('data-user-id') as string;
      console.log('User id is ', userId);
      renderLeftPanel(userId);
    }
  });
}

/**
 * @brief Cleans the left panel by removing recent matches.
 */
function cleanLeftPanel(): void {
  const recentMatchList = document.getElementById('recent-matches');
  if (!recentMatchList) {
    console.log("Couldn't find recent match list");
    return;
  }

  recentMatchList.innerHTML = '';

  const recentTournamentList = document.getElementById('recent-tournaments');
  if (!recentTournamentList) {
    console.log("Couldn't find recent tournament list");
    return;
  }

  recentTournamentList.innerHTML = '';
}
