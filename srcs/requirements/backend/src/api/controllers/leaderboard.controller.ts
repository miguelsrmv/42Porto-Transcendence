import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';

export async function getLeaderboard(request: FastifyRequest, reply: FastifyReply) {
  const leaderboard = await prisma.leaderboard.findMany({
    select: { userId: true, score: true },
    orderBy: { score: 'desc' },
  });
  reply.send(leaderboard);
}
