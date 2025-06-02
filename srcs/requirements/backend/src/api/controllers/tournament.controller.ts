import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { contractProvider } from '../services/blockchain.services';
import { processTournamentData } from '../services/tournament.services';

export type TournamentPlayerInfo = {
  tournamentId: string;
  userId: string;
};

export async function getTournamentById(
  request: FastifyRequest<{ Body: TournamentPlayerInfo }>,
  reply: FastifyReply,
) {
  try {
    // const data = await generateTournamentData(request.params.id);
    const rawData: string = await contractProvider.getPlayerTournamentScores(
      request.body.tournamentId,
      request.body.userId,
    );
    const data = processTournamentData(rawData);
    reply.send(data);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserLastTournaments(
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
    const fixedIds: [string, string, string] = [
      ...ids.slice(0, 3), // get at most 3 entries
      '',
      '',
      '', // add empty strings
    ].slice(0, 3) as [string, string, string];
    const positions = await contractProvider.getLastThreeTournamentsPosition(
      request.params.id,
      fixedIds,
    );
    const data = tournaments.map((t, index) => ({
      tournamentId: t.tournamentId,
      tournamentType: t.tournamentType,
      position: positions[index] ?? null,
    }));
    reply.send(data);
  } catch (error) {
    handleError(error, reply);
  }
}
