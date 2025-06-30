import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';

export async function getUserMatches(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ user1Id: request.params.id }, { user2Id: request.params.id }],
    },
    orderBy: { createdAt: 'desc' },
  });
  reply.send(matches);
}

export async function getMatchById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
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
}
