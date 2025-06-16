import { wait } from '../utils/helpers.js';
import { fadeIn, fadeOut } from './animations.js';

export async function showWaitingModal(): Promise<void> {
  const gameSettingsMenu = document.getElementById('game-settings-menu');
  if (!gameSettingsMenu) {
    console.log('Game settings menu not found');
    return;
  }

  const playButtonContainer = document.getElementById('play-button-container');
  if (!playButtonContainer) {
    console.log('Play Button Container not found');
    return;
  }

  fadeOut(gameSettingsMenu);
  fadeOut(playButtonContainer);

  const waitingModal = document.getElementById('waiting-game-modal');
  if (!waitingModal) {
    console.log('Waiting modal not found');
    return;
  }

  setTimeout(() => fadeIn(waitingModal), 750);

  await wait(1);

  waitingModal.classList.remove('animate-fade-in');
  waitingModal.classList.add('animate-pulse');
}

export async function waitForNextGame(): Promise<void> {
  const gameStats = document.getElementById('game-stats');
  if (!gameStats) {
    console.log('Game stats not found');
    return;
  }

  fadeOut(gameStats);

  const waitingModal = document.getElementById('waiting-next-game-modal');
  if (!waitingModal) {
    console.log('Waiting modal not found');
    return;
  }

  setTimeout(() => fadeIn(waitingModal), 750);

  await wait(1);

  waitingModal.classList.remove('animate-fade-in');
  waitingModal.classList.add('animate-pulse');
}

export async function waitForNextTournamentGameCountdown(): Promise<void> {
  const gameStats = document.getElementById('game-stats');
  if (!gameStats) {
    console.log('Game stats not found');
    return;
  }

  fadeOut(gameStats);

  const waitingModal = document.getElementById('waiting-next-game-modal');
  if (!waitingModal) {
    console.log('Waiting modal not found');
    return;
  }

  waitingModal.innerText = 'Next game in 5...';

  setTimeout(() => fadeIn(waitingModal), 750);

  await wait(1);

  waitingModal.classList.remove('animate-fade-in');
  waitingModal.classList.add('animate-pulse');

  let i: number = 5;

  while (i) {
    waitingModal.innerText = `Next game in ${i}...`;
    await wait(1);
    i--;
  }
}
