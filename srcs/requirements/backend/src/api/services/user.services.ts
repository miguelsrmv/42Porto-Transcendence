import { Match } from '@prisma/client';
import { getUserRank, getUserScore } from './leaderboard.services';

export async function getUserGlobalStats(matches: Match[], userId: string) {
  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.winnerId === userId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: await getUserScore(userId),
    rank: await getUserRank(userId),
  };
}
