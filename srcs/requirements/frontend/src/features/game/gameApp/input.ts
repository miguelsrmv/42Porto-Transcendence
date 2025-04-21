import { SPEED } from './game.js';
import { Player } from './player.js';

// Interface for paddle to define expected structure
interface Paddle {
  speedY: number;
}

// Track key states
const keys: Record<string, boolean> = {};

// Add event listeners for keydown and keyup events
export function setupInput(leftPlayer: Player, rightPlayer: Player): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === ' ') {
      leftPlayer.attack?.attack();
    } else if (e.key === 'Enter') {
      rightPlayer.attack?.attack();
    } else {
      keys[e.key] = true;
    }
  });

  window.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.key] = false;
  });
}

// Update paddle movement based on key input
export function handleInput(leftPlayer: Player, rightPlayer: Player): void {
  // Left paddle ('w' and 's')
  if (keys['w']) {
    leftPlayer.ownPaddle.speedY = -SPEED;
  } else if (keys['s']) {
    leftPlayer.ownPaddle.speedY = SPEED;
  } else {
    leftPlayer.ownPaddle.speedY = 0;
  }

  // Right paddle ('ArrowUp' and 'ArrowDown')
  if (keys['ArrowUp']) {
    rightPlayer.ownPaddle.speedY = -SPEED;
  } else if (keys['ArrowDown']) {
    rightPlayer.ownPaddle.speedY = SPEED;
  } else {
    rightPlayer.ownPaddle.speedY = 0;
  }
}
