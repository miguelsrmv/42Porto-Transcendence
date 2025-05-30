// import { TournamentPlayer } from '../controllers/tournament.controller';
import { tournamentPlayer } from '../../ws/remoteGameApp/types';
import { prisma } from '../../utils/prisma';

export async function generateTournamentData(tournamentId: string) {
  const users = await prisma.user.findMany({
    take: 8,
    select: {
      id: true,
    },
  });
  if (users.length < 8) throw 'Less than 8 users in the database';
  const tournamentData: tournamentPlayer[] = [
    {
      id: users[0].id,
      userAlias: 'alias1',
      avatarPath: '../../../../static/avatar/default/mario.png',
      quarterFinalScore: '5',
      semiFinalScore: '3',
      finalScore: '',
    },
    {
      id: users[1].id,
      userAlias: 'alias2',
      avatarPath: '../../../../static/avatar/default/bowser.png',
      quarterFinalScore: '5',
      semiFinalScore: '5',
      finalScore: '2',
    },
    {
      id: users[2].id,
      userAlias: 'alias3',
      avatarPath: '../../../../static/avatar/default/cloud.png',
      quarterFinalScore: '5',
      semiFinalScore: '5',
      finalScore: '5',
    },
    {
      id: users[3].id,
      userAlias: 'alias4',
      avatarPath: '../../../../static/avatar/default/chrom.png',
      quarterFinalScore: '3',
      semiFinalScore: '',
      finalScore: '',
    },
    {
      id: users[4].id,
      userAlias: 'alias5',
      avatarPath: '../../../../static/avatar/default/corrin.png',
      quarterFinalScore: '2',
      semiFinalScore: '',
      finalScore: '',
    },
    {
      id: users[5].id,
      userAlias: 'alias6',
      avatarPath: '../../../../static/avatar/default/daisy.png',
      quarterFinalScore: '5',
      semiFinalScore: '3',
      finalScore: '',
    },
    {
      id: users[6].id,
      userAlias: 'alias7',
      avatarPath: '../../../../static/avatar/default/bowser_jr.png',
      quarterFinalScore: '4',
      semiFinalScore: '',
      finalScore: '',
    },
    {
      id: users[7].id,
      userAlias: 'alias8',
      avatarPath: '../../../../static/avatar/default/bayonetta.png',
      quarterFinalScore: '1',
      semiFinalScore: '',
      finalScore: '',
    },
  ];
  return tournamentData;
}

// // export async function createTournamentParticipant(participant: TournamentPlayer) {
// //   const tournament = await prisma.tournament.findUniqueOrThrow({
// //     where: { id: participant.tournamentId },
// //     include: { participants: true,  },
// //   });
// //   if (tournament.participants.length >= tournament.maxParticipants)
// //     throw new Error('Tournament is full');

// //   const registeredPlayer = await prisma.tournamentParticipant.findUnique({
// //     where: {
// //       tournamentId_userId: {
// //         tournamentId: participant.tournamentId!,
// //         userId: participant.userId,
// //       },
// //     },
// //   });
// //   if (registeredPlayer) throw new Error('Player is already registered in this tournament');

// //   return await prisma.tournamentParticipant.create({
// //     data: {
// //       userId: participant.userId,
// //       tournamentId: participant.tournamentId!,
// //       alias: participant.alias,
// //       character: participant.character,
// //     },
// //   });
// // }

// export async function createTournamentByUser(userId: string) {
//   return await prisma.tournament.create({
//     data: {
//       settings: '',
//       createdBy: {
//         connect: { id: userId },
//       },
//     },
//   });
// }
