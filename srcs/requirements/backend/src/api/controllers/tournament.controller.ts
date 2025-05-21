import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { Character } from '@prisma/client';
import { contract, wallet } from '../services/blockchain.services'

// export type TournamentCreate = {
//   name?: string;
//   maxParticipants: number;
//   createdBy: string;
//   settings?: string;
// };

// type TournamentUpdate = {
//   status: TournamentStatus;
//   currentRound: number;
// };

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
}

// export async function getAllTournaments(request: FastifyRequest, reply: FastifyReply) {
//   try {
//     const tournaments = await prisma.tournament.findMany({
//       include: {
//         participants: true,
//         matches: true,
//       },
//     });
//     reply.send(tournaments);
//   } catch (error) {
//     handleError(error, reply);
//   }
// }

// export async function getUserTournaments(
//   request: FastifyRequest<{ Params: IParams }>,
//   reply: FastifyReply,
// ) {
//   try {
//     const tournaments = await prisma.tournament.findMany({
//       include: {
//         participants: true,
//       },
//       where: {
//         participants: {
//           some: {
//             userId: request.params.id,
//           },
//         },
//       },
//     });
//     reply.send(tournaments);
//   } catch (error) {
//     handleError(error, reply);
//   }
// }

// export async function getTournamentById(
//   request: FastifyRequest<{ Params: IParams }>,
//   reply: FastifyReply,
// ) {
//   try {
//     const tournament = await prisma.tournament.findUniqueOrThrow({
//       where: { id: request.params.id },
//       include: {
//         participants: true,
//       },
//     });
//     reply.send(tournament);
//   } catch (error) {
//     handleError(error, reply);
//   }
// }

// // Unused for business logic
// // export async function createTournament(request: FastifyRequest, reply: FastifyReply) {
// //   try {
// //     reply.send();
// //   } catch (error) {
// //     handleError(error, reply);
// //   }
// // }

// // Unused for business logic
// // TODO: create function updateTournamentMatches
// export async function updateTournament(
//   request: FastifyRequest<{ Params: IParams; Body: TournamentUpdate }>,
//   reply: FastifyReply,
// ) {
//   try {
//     const { status, currentRound } = request.body;

//     const tournament = await prisma.tournament.update({
//       where: { id: request.params.id },
//       data: {
//         status: status,
//         currentRound: currentRound,
//       },
//     });
//     reply.send(tournament);
//   } catch (error) {
//     handleError(error, reply);
//   }
// }

// export async function startTournament(
//   request: FastifyRequest<{ Params: IParams }>,
//   reply: FastifyReply,
// ) {
//   try {
//     const tournament = await prisma.tournament.update({
//       where: { id: request.params.id },
//       data: {
//         status: TournamentStatus.ACTIVE,
//       },
//     });
//     reply.send(tournament);
//   } catch (error) {
//     handleError(error, reply);
//   }
// }

// export async function deleteTournament(
//   request: FastifyRequest<{ Params: IParams }>,
//   reply: FastifyReply,
// ) {
//   try {
//     const tournament = await prisma.tournament.delete({
//       where: { id: request.params.id },
//     });
//     reply.send(tournament);
//   } catch (error) {
//     handleError(error, reply);
//   }
// }

export async function addPlayerToTournament(
  request: FastifyRequest<{ Body: TournamentPlayer }>,
  reply: FastifyReply,
) {
  try {
    const { tournamentId, userId, alias, character } = request.body;

    if (!tournamentId) {
      return reply
        .status(400)
        .send({ error: 'tournamentId must be provided (starting point)' });
    }

    const BCParticiant = {userId: BigInt(userId), alias: BigInt(alias), character: BigInt(character)};

    const tx = await contract.joinTournament(BigInt(tournamentId), BCParticiant);
    await tx.wait();

    const participant = await prisma.tournamentParticipant.create({data: {
      userId: userId,
      tournamentId: tournamentId!,
    },});

    await prisma.user.update({where: {id: userId}, data: {tournaments: {connect: {id: participant.id},},},})
  
    reply.send("OK");
  } catch (error) {
    console.error('Error in addPlayerToTournament:', error);
    reply.status(500).send({ error: 'Failed to join tournament' });
  }
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

    const tx = await contract.saveScore(BigInt(tournamentId), BigInt(userOneId), BigInt(scoreOne), BigInt(userTwoId), BigInt(scoreTwo));
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

    const tx = await contract.addWinner(BigInt(tournamentId), BigInt(userId));
    await tx.wait();

    reply.send("OK");
  } catch (error) {
    console.error('Error in addWinner:', error);
    reply.status(500).send({ error: 'Failed to add winner' });
  }
}
