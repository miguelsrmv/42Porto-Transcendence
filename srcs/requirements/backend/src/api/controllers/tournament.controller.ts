import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { Character, TournamentStatus } from '@prisma/client';
// import { ethers } from 'ethers';
import {
  createTournamentParticipant,
  createTournamentByUser,
} from '../services/tournament.services';

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

export type TournamentPlayer = {
  tournamentId?: string;
  userId: string;
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

export async function getUserTournaments(
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
            userId: request.params.id,
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

// Unused for business logic
export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
  try {
    reply.send();
  } catch (error) {
    handleError(error, reply);
  }
}

// Unused for business logic
// TODO: create function updateTournamentMatches
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
  request: FastifyRequest<{ Body: TournamentPlayer }>,
  reply: FastifyReply,
) {
  try {
    if (!request.body.tournamentId) {
      const newTournament = await createTournamentByUser(request.body.userId);
      request.body.tournamentId = newTournament.id;
    }
    const newParticipant = await createTournamentParticipant(request.body);

    const updatedTournament = await prisma.tournament.update({
      where: { id: request.body.tournamentId },
      data: {
        participants: {
          connect: { id: newParticipant.id },
        },
      },
      include: { participants: true },
    });

    reply.send(updatedTournament);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function tournamentBlockchain(request: FastifyRequest, reply: FastifyReply) {
  // try {
  //   // Avalanche C-Chain RPC URL
  //   const providerUrl = 'https://api.avax-test.network/ext/bc/C/rpc';
  //   const provider = new ethers.JsonRpcProvider(providerUrl);
  //   await provider.request({ method: 'eth_requestAccounts' });
  //   reply.send();
  // } catch (error) {
  //   handleError(error, reply);
  // }
}
