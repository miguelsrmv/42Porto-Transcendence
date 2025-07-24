import type { gameStats } from '../game/gameStats/gameStatsTypes.js';

// Define the gameEnd event
export interface gameEnd {
  matchStats: gameStats;
}

declare global {
  interface WindowEventMap {
    'game:end': CustomEvent<gameEnd>;
  }
}

export {};
