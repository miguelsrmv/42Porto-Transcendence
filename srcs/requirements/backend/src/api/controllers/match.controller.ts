import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';

export async function getUserMatches(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: request.params.id }, { user2Id: request.params.id }],
      },
      orderBy: { updatedAt: 'desc' },
    });
    reply.send(matches);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getMatchById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const match = await prisma.match.findUniqueOrThrow({
      where: { id: request.params.id },
      select: {
        mode: true,
        user1Id: true,
        user2Id: true,
        user1Character: true,
        user2Character: true,
        createdAt: true,
        stats: true,
        user1Alias: true,
        user2Alias: true,
      },
    });
    reply.send(match);
  } catch (error) {
    handleError(error, reply);
  }
}
