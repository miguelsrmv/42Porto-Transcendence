import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';
import { Character, TournamentStatus } from '@prisma/client';
import { defaultGameSettings } from '../utils/defaults';

export type TournamentCreate = {
  name?: string;
  maxParticipants: number;
  createdBy: string;
  settings?: string;
};

type TournamentUpdate = {
  status: TournamentStatus;
  currentRound: number;
};

type TournamentPlayer = {
  playerId: string;
  alias: string;
  character: Character;
};

export async function getAllTournaments(request: FastifyRequest, reply: FastifyReply) {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        participants: true,
        matches: true,
      },
    });
    reply.send(tournaments);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getPlayerTournaments(
  request: FastifyRequest<{ Params: IParams }>,
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
  request: FastifyRequest<{ Params: IParams }>,
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
    const { name, maxParticipants, createdBy } = request.body;
    const { settings } = request.body;

    const finalSettings = { ...defaultGameSettings, ...(settings ? JSON.parse(settings) : {}) };

    const tournament = await prisma.tournament.create({
      data: {
        name: name,
        maxParticipants: maxParticipants,
        settings: JSON.stringify(finalSettings),
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
  request: FastifyRequest<{ Params: IParams; Body: TournamentUpdate }>,
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

export async function startTournament(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const tournament = await prisma.tournament.update({
      where: { id: request.params.id },
      data: {
        status: TournamentStatus.ACTIVE,
        currentRound: 1,
      },
    });
    reply.send(tournament);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function deleteTournament(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const tournament = await prisma.tournament.delete({
      where: { id: request.params.id },
    });
    reply.send(tournament);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function addPlayerToTournament(
  request: FastifyRequest<{ Params: IParams; Body: TournamentPlayer }>,
  reply: FastifyReply,
) {
  try {
    const { playerId, alias, character } = request.body;

    const tournament = await prisma.tournament.findUniqueOrThrow({
      where: { id: request.params.id },
      include: { participants: true },
    });
    if (tournament.participants.length >= tournament.maxParticipants)
      throw new Error('Tournament is full');

    const registeredPlayer = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_playerId: {
          tournamentId: request.params.id,
          playerId: playerId,
        },
      },
    });
    if (registeredPlayer) throw new Error('Player is already registered in this tournament');

    const participant = await prisma.tournamentParticipant.create({
      data: {
        playerId: playerId,
        tournamentId: request.params.id,
        alias: alias,
        character: character,
      },
    });

    const updatedTournament = await prisma.tournament.update({
      where: { id: request.params.id },
      data: {
        participants: {
          connect: { id: participant.id },
        },
      },
      include: { participants: true },
    });

    reply.send(updatedTournament);
  } catch (error) {
    handleError(error, reply);
  }
}
