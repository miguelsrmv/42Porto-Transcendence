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
    });
    reply.send(match);
  } catch (error) {
    handleError(error, reply);
  }
}
