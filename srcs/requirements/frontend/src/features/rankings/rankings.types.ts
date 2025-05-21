export interface matchData {
  createdAt: string;
  id: string;
  mode: string;
  settings: string;
  updatedAt: string;
  user1Character: string;
  user1Id: string;
  user1Score: number;
  user2Character: string;
  user2Id: string;
  user2Score: number;
  winnerId: string;
}

export interface leaderboardData {
  userId: string;
  score: number;
}

export interface statsData {
  totalMatches: number;
  wins: number;
  losses: number;
  winrate: number;
  points: number;
  rank: number;
}

export interface userData {
  username: string;
  lastActiveAt: string;
  avatarUrl: string;
  rank: number;
  points: number;
  onlineState: string;
}
