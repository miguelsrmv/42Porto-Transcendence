// import { TournamentPlayer } from '../controllers/tournament.controller';
// import { prisma } from '../../utils/prisma';

// export async function createTournamentParticipant(participant: TournamentPlayer) {
//   // const tournament = await prisma.tournament.findUniqueOrThrow({
//   //   where: { id: participant.tournamentId },
//   //   include: { participants: true },
//   // });
//   // if (tournament.participants.length >= tournament.maxParticipants)
//   //   throw new Error('Tournament is full');

//   // const registeredPlayer = await prisma.tournamentParticipant.findUnique({
//   //   where: {
//   //     tournamentId_userId: {
//   //       // tournamentId: participant.tournamentId!,
//   //       userId: participant.userId,
//   //     },
//   //   },
//   // });
//   // if (registeredPlayer) throw new Error('Player is already registered in this tournament');

//   return await prisma.tournamentParticipant.create({
//     data: {
//       userId: participant.userId,
//       tournamentId: participant.tournamentId!,
//       // alias: participant.alias,
//       // character: participant.character,
//     },
//   });
// }

// // export async function createTournamentByUser(userId: string) {
// //   return await prisma.tournament.create({
// //     data: {
// //       settings: '',
// //       createdBy: {
// //         connect: { id: userId },
// //       },
// //     },
// //   });
// // }
