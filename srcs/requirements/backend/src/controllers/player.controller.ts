import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';

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
    const wonMatches = playerMatches.filter((match) => match.winnerId === request.params.id);
    const lostMatches = playerMatches.length - wonMatches.length;
    const stats = {
      matchesPlayed: playerMatches.length,
      matchesWon: wonMatches.length,
      matchesLost: lostMatches,
      winRate: (wonMatches.length / playerMatches.length) * 100 || 0 + '%',
      points: wonMatches.length * 3 + lostMatches, // Assuming 3 points for a win and 1 for a loss
    };

    reply.send(stats);
  } catch (error) {
    handleError(error, reply);
  }
}
