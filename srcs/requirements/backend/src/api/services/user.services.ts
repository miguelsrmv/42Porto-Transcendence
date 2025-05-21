import { Match } from '@prisma/client';
import { prisma } from '../../utils/prisma';

export async function getUserGlobalStats(matches: Match[], userId: string) {
  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.winnerId === userId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: wins * 3, // Assuming 3 point for a win and 0 for a loss
    rank: await getUserRank(userId),
  };
}

export async function getUserRank(id: string) {
  const userLeaderboard = await prisma.leaderboard.findUniqueOrThrow({
    where: { userId: id },
  });
  const userScore = userLeaderboard.score;
  const betterPlayers = await prisma.leaderboard.count({
    where: { score: { gt: userScore } },
  });
  return betterPlayers + 1;
}
