import { Match } from '@prisma/client';
import { getUserRank, getUserScore } from './leaderboard.services';
import { prisma } from '../../utils/prisma';
import app from '../../app';

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

export async function getAvatarFromPlayer(playerID: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: playerID } });
  if (!user) app.log.error('User not found in getAvatarFromPlayer');
  return user.avatarUrl;
}
