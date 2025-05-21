import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { Character, GameMode } from '@prisma/client';
import { contractSigner, contractProvider } from '../services/blockchain.services'

export type TournamentPlayer = {
  tournamentId: string;
  userId: string;
  alias: string;
  character: string;
};

export type MatchInfo = {
  tournamentId: string;
  userOneId: string;
  userTwoId: string;
  scoreOne: number;
  scoreTwo: number;
};

export type TournamentAndType = {
  tournamentId: number;
  type: GameMode;
}

export type TournamentsFromPlayer = {
  tournamentsIdsandTypes: TournamentAndType[];
}

export type WinnerInfo = {
  tournamentId: string;
  userId: string;
}

export async function saveTournamentScore(
  request: FastifyRequest<{ Body: MatchInfo }>,
  reply: FastifyReply,
) {
  try {
    const { tournamentId, userOneId, userTwoId, scoreOne, scoreTwo } = request.body;

    if (!tournamentId) {
      return reply
        .status(400)
        .send({ error: 'tournamentId must be provided (starting point)' });
    }

    const tx = await contractSigner.saveScore(BigInt(tournamentId), BigInt(userOneId), BigInt(scoreOne), BigInt(userTwoId), BigInt(scoreTwo));
    await tx.wait();

    reply.send("OK");
  } catch (error) {
    console.error('Error in saveTournamentScore:', error);
    reply.status(500).send({ error: 'Failed to save scores' });
  }
}

export async function addMatchWinner(
  request: FastifyRequest<{ Body: WinnerInfo }>,
  reply: FastifyReply,
) {
  try {
    const { tournamentId, userId } = request.body;

    if (!tournamentId) {
      return reply
        .status(400)
        .send({ error: 'tournamentId must be provided (starting point)' });
    }

    const tx = await contractSigner.addWinner(BigInt(tournamentId), BigInt(userId));
    await tx.wait();

    reply.send("OK");
  } catch (error) {
    console.error('Error in addWinner:', error);
    reply.status(500).send({ error: 'Failed to add winner' });
  }
}

export async function getUserLastThreeTournaments(
  request: FastifyRequest<{ Body: TournamentsFromPlayer, Params: IParams}>,
  reply: FastifyReply,
) {
  try {
    const tx = await contractProvider.getLastThreeTournamentsPosition(BigInt(request.params.id), request.body.tournamentsIdsandTypes);
    await tx.wait();

    reply.send("OK");
  } catch (error) {
    console.error('Error in addWinner:', error);
    reply.status(500).send({ error: 'Failed to add winner' });
  }
}

export async function getUserTournaments(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const tournamentIds = await prisma.tournamentParticipant.findMany({
      where: { userId: request.params.id },
      select: { tournamentId: true, tournamentType: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    reply.send();
  } catch (error) {
    handleError(error, reply);
  }
}

