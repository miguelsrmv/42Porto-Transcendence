import { Match, GameMode } from '@prisma/client';
import { prisma } from '../../utils/prisma';

// Unused
export function getUserClassicStats(matches: Match[], userId: string) {
  const classicMatches = matches.filter((match) => match.mode === GameMode.CLASSIC);
  const totalMatches = classicMatches.length;
  const wins = classicMatches.filter((match) => match.winnerId === userId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: wins * 3 + losses, // Assuming 3 points for a win and 1 for a loss
  };
}

// Unused
export function getUserCrazyStats(matches: Match[], userId: string) {
  const crazyMatches = matches.filter((match) => match.mode === GameMode.CRAZY);
  const totalMatches = crazyMatches.length;
  const wins = crazyMatches.filter((match) => match.winnerId === userId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: wins * 3 + losses, // Assuming 3 points for a win and 1 for a loss
  };
}

export async function getUserGlobalStats(matches: Match[], userId: string) {
  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.winnerId === userId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: wins, // Assuming 1 point for a win and 0 for a loss
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
