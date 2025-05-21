import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { GameMode } from '@prisma/client';

export type MatchCreate = {
  mode: GameMode;
  user1Id: string;
  user2Id: string;
  settings: string;
};

type MatchUpdate = {
  duration: number;
  winnerId: string;
  user1Score: number;
  user2Score: number;
};

// TODO: delete in the end
export async function getAllMatches(request: FastifyRequest, reply: FastifyReply) {
  try {
    const matches = await prisma.match.findMany();
    reply.send(matches);
  } catch (error) {
    handleError(error, reply);
  }
}

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

export async function getOwnUserMatches(request: FastifyRequest, reply: FastifyReply) {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: request.user.id }, { user2Id: request.user.id }],
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

// TODO: Create createLocalMatch (creates match between logged in user and 'guest')

export async function createMatch(
  request: FastifyRequest<{ Body: MatchCreate }>,
  reply: FastifyReply,
) {
  try {
    const { user1Id, user2Id, mode } = request.body;
    const { settings } = request.body;

    const match = await prisma.match.create({
      data: {
        mode: mode,
        user1Id: user1Id,
        user2Id: user2Id,
        settings: JSON.stringify(settings),
      },
    });
    reply.send(match);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateMatch(
  request: FastifyRequest<{ Params: IParams; Body: MatchUpdate }>,
  reply: FastifyReply,
) {
  try {
    const match = await prisma.match.update({
      where: { id: request.params.id },
      data: request.body,
    });
    reply.send(match);
  } catch (error) {
    handleError(error, reply);
  }
}
