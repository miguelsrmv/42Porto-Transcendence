/**
 * @file rankings.types.ts
 * @brief Defines the types used for leaderboard creating data in the application.
 */

/**
 * Represents the data for a match.
 */
export interface matchData {
  createdAt: string;
  id: string;
  mode: string;
  settings: string;
  stats: string;
  updatedAt: string;
  user1Character: string;
  user1Id: string;
  user1Score: number;
  user1Alias: string;
  user2Character: string;
  user2Id: string;
  user2Score: number;
  user2Alias: string;
  winnerId: string;
}

/**
 * Represents the data for a tournament.
 */
export interface tournamentData {
  tournamentId: string;
  tournamentType: string;
  position: string;
}

/**
 * Represents the data for a leaderboard entry.
 */
export interface leaderboardData {
  userId: string;
  score: number;
}

/**
 * Represents the statistics data for a user.
 */
export interface statsData {
  totalMatches: number;
  wins: number;
  losses: number;
  winrate: number;
  points: number;
  rank: number;
  tournaments: number;
}

/**
 * Represents the data for a user.
 */
export interface userData {
  username: string;
  lastActiveAt: string;
  avatarUrl: string;
  rank: number;
  points: number;
  onlineState: string;
}
