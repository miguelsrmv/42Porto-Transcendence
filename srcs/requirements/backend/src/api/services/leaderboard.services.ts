import { prisma } from '../../utils/prisma';
import { Player } from '../../ws/remoteGameApp/player';

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

export async function getUserScore(id: string) {
  const userLeaderboard = await prisma.leaderboard.findUniqueOrThrow({
    where: { userId: id },
  });
  return userLeaderboard.score;
}

export async function updateLeaderboardRemote(winningPlayer: Player, losingPlayer: Player) {
  await prisma.leaderboard.update({
    where: { userId: winningPlayer.id },
    data: { score: { increment: 3 } },
  });

  const losingPlayerRecord = await prisma.leaderboard.findUnique({
    where: { userId: losingPlayer.id },
  });
  if (losingPlayerRecord && losingPlayerRecord.score > 0) {
    await prisma.leaderboard.update({
      where: { userId: losingPlayer.id },
      data: { score: { decrement: 1 } },
    });
  }
}

export async function updateLeaderboardTournament(winningPlayerId: string, round: number) {
  if (round > 3) return;
  const increments = [1, 3, 8];
  await prisma.leaderboard.update({
    where: { userId: winningPlayerId },
    data: { score: { increment: increments[round - 1] } },
  });
}
