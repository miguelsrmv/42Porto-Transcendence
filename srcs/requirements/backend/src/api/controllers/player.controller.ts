import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { getPlayerClassicStats, getPlayerCustomStats } from '../services/player.services';

type PlayerUpdate = {
  name?: string;
  bio?: string;
};

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

export async function getPlayerStats(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const playerMatches = await prisma.match.findMany({
      where: { OR: [{ player1Id: request.params.id }, { player2Id: request.params.id }] },
    });
    const stats = {
      classic: getPlayerClassicStats(playerMatches, request.params.id),
      custom: getPlayerCustomStats(playerMatches, request.params.id),
    };

    reply.send({ stats });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getOwnPlayer(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user.id;
    const player = await prisma.player.findUniqueOrThrow({
      where: { userId: userId },
    });

    reply.send(player);
  } catch (error) {
    handleError(error, reply);
  }
}
