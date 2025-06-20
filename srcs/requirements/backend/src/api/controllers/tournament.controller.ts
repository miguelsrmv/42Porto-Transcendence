import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { contractProvider } from '../services/blockchain.services';
import { processTournamentData } from '../services/tournament.services';

export async function getTournamentStatus(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  const rawParticipants: string[][] = await contractProvider.getMatchedParticipants(
    request.params.id,
  );
  const scores: number[] = await contractProvider.getScores(request.params.id);
  const data = await processTournamentData(rawParticipants, scores);
  reply.send(data);
}

export async function getUserLastTournaments(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
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
}
