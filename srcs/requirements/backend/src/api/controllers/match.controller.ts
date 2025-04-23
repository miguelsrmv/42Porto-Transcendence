import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { MatchMode } from '@prisma/client';
import { defaultGameSettings } from '../../utils/defaults';

export type MatchCreate = {
  mode: MatchMode;
  player1Id: string;
  player2Id: string;
  settings: string;
};

type MatchUpdate = {
  duration: number;
  winnerId: string;
  player1Score: number;
  player2Score: number;
};

export async function getAllMatches(request: FastifyRequest, reply: FastifyReply) {
  try {
    const matches = await prisma.match.findMany();
    reply.send(matches);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getPlayerMatches(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ player1Id: request.params.id }, { player2Id: request.params.id }],
      },
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

export async function createMatch(
  request: FastifyRequest<{ Body: MatchCreate }>,
  reply: FastifyReply,
) {
  try {
    const { player1Id, player2Id, mode } = request.body;
    const { settings } = request.body;

    const finalSettings = { ...defaultGameSettings, ...(settings ? JSON.parse(settings) : {}) };

    const match = await prisma.match.create({
      data: {
        mode: mode,
        player1Id: player1Id,
        player2Id: player2Id,
        settings: JSON.stringify(finalSettings),
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
