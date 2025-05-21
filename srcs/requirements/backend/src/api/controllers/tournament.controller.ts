// import { FastifyReply, FastifyRequest } from 'fastify';
// import { prisma } from '../../utils/prisma';
// import { handleError } from '../../utils/errorHandler';
// import { Character, TournamentStatus } from '@prisma/client';
// // import { ethers } from 'ethers';
// import {
//   // createTournamentParticipant,
//   createTournamentByUser,
// } from '../services/tournament.services';

// export type TournamentPlayer = {
//   tournamentId?: string;
//   userId: string;
//   alias: string;
//   character: Character;
// };

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

// export async function tournamentBlockchain(request: FastifyRequest, reply: FastifyReply) {
//   // try {
//   //   // Avalanche C-Chain RPC URL
//   //   const providerUrl = 'https://api.avax-test.network/ext/bc/C/rpc';
//   //   const provider = new ethers.JsonRpcProvider(providerUrl);
//   //   await provider.request({ method: 'eth_requestAccounts' });
//   //   reply.send();
//   // } catch (error) {
//   //   handleError(error, reply);
//   // }
// }
