import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { contractProvider } from '../services/blockchain.services';
import { processTournamentData } from '../services/tournament.services';

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

export type WinnerInfo = {
  tournamentId: string;
  userId: string;
};

export async function getTournamentById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    // const data = await generateTournamentData(request.params.id);
    const rawData = await contractProvider.getMatchedParticipants(request.params.id);
    const rawScores: number[] = await contractProvider.getScores(request.params.id);
    const data = processTournamentData(rawData);
    reply.send(data);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserLastThreeTournaments(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const tournaments = await prisma.tournamentParticipant.findMany({
      where: { userId: request.params.id },
      select: { tournamentId: true, tournamentType: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    const ids = tournaments.map((t) => t.tournamentId);
    // TODO: force array with 3 strings ?
    const positions = await contractProvider.getLastThreeTournamentsPosition(
      request.params.id,
      ids,
    );
    const data = tournaments.map((t, index) => ({
      tournamentId: t.tournamentId,
      tournamentType: t.tournamentType,
      position: positions[index] ?? null,
    }));
    reply.send(data);
  } catch (error) {
    console.error('Error in addWinner:', error);
    reply.status(500).send({ error: 'Failed to add winner' });
  }
}
