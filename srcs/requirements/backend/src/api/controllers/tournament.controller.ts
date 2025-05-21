import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
// import { ethers } from 'ethers';

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

// export async function getTournamentById(
//   request: FastifyRequest<{ Params: IParams }>,
//   reply: FastifyReply,
// ) {
//   try {
//     reply.send();
//   } catch (error) {
//     handleError(error, reply);
//   }
// }
