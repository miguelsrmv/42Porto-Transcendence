import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';

interface PlayerUpdate {
  name?: string;
  bio?: string;
}

export async function getAllPlayers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const players = await prisma.player.findMany({
      include: {
        friends: true,
      },
    });
    reply.send(players);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getPlayerById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const player = await prisma.player.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        friends: true,
      },
    });
    reply.send(player);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updatePlayer(
  request: FastifyRequest<{ Params: IParams; Body: PlayerUpdate }>,
  reply: FastifyReply,
) {
  try {
    const player = await prisma.player.update({
      where: { id: request.params.id },
      data: request.body,
    });
    reply.send(player);
  } catch (error) {
    handleError(error, reply);
  }
}
