import { FastifyReply, FastifyRequest } from 'fastify';
import { handleError } from '../../utils/errorHandler';
import { prisma } from '../../utils/prisma';

export async function getLeaderboard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      select: { userId: true, score: true },
      orderBy: { score: 'desc' },
    });
    reply.send(leaderboard);
  } catch (error) {
    handleError(error, reply);
  }
}
