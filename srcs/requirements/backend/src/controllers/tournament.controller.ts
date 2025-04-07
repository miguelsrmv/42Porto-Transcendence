import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';
import { TournamentStatus } from '@prisma/client';

type TournamentCreate = {
  name?: string;
  maxParticipants: number;
  createdBy: string;
  gameSettings?: object;
};

type TournamentUpdate = {
  status: TournamentStatus;
  currentRound: number;
};

export async function getAllTournaments(request: FastifyRequest, reply: FastifyReply) {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        participants: true,
        matches: true,
        gameSettings: true,
      },
    });
    reply.send(tournaments);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getPlayerTournaments(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        participants: true,
      },
      where: {
        participants: {
          some: {
            playerId: request.params.id,
          },
        },
      },
    });
    reply.send(tournaments);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getTournamentById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    const tournament = await prisma.tournament.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        participants: true,
      },
    });
    reply.send(tournament);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function createTournament(
  request: FastifyRequest<{ Body: TournamentCreate }>,
  reply: FastifyReply,
) {
  try {
    const { name, maxParticipants, createdBy, gameSettings } = request.body;

    const tournament = await prisma.tournament.create({
      data: {
        name: name,
        maxParticipants: maxParticipants,
        gameSettings: gameSettings,
        createdBy: {
          connect: { id: createdBy },
        },
      },
    });
    reply.send(tournament);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateTournament(
  request: FastifyRequest<{ Params: { id: string }; Body: TournamentUpdate }>,
  reply: FastifyReply,
) {
  try {
    const { status, currentRound } = request.body;

    const tournament = await prisma.tournament.update({
      where: { id: request.params.id },
      data: {
        status: status,
        currentRound: currentRound,
      },
    });
    reply.send(tournament);
  } catch (error) {
    handleError(error, reply);
  }
}
