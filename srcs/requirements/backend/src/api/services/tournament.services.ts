import { tournamentPlayer } from '../../ws/remoteGameApp/types';
import { prisma } from '../../utils/prisma';

export function processTournamentData(data: any) {

}

export async function generateTournamentData(tournamentId: string) {
  const users = await prisma.user.findMany({
    take: 8,
    select: {
      id: true,
      avatarUrl: true,
    },
  });
  if (users.length < 8) throw 'Less than 8 users in the database';
  const tournamentData: tournamentPlayer[] = [
    {
      id: users[0].id,
      userAlias: 'alias1',
      avatarPath: users[0].avatarUrl,
      quarterFinalScore: '5',
      semiFinalScore: '3',
      finalScore: '',
    },
    {
      id: users[1].id,
      userAlias: 'alias2',
      avatarPath: users[1].avatarUrl,
      quarterFinalScore: '5',
      semiFinalScore: '5',
      finalScore: '2',
    },
    {
      id: users[2].id,
      userAlias: 'alias3',
      avatarPath: users[2].avatarUrl,
      quarterFinalScore: '5',
      semiFinalScore: '5',
      finalScore: '5',
    },
    {
      id: users[3].id,
      userAlias: 'alias4',
      avatarPath: users[3].avatarUrl,
      quarterFinalScore: '3',
      semiFinalScore: '',
      finalScore: '',
    },
    {
      id: users[4].id,
      userAlias: 'alias5',
      avatarPath: users[4].avatarUrl,
      quarterFinalScore: '2',
      semiFinalScore: '',
      finalScore: '',
    },
    {
      id: users[5].id,
      userAlias: 'alias6',
      avatarPath: users[5].avatarUrl,
      quarterFinalScore: '5',
      semiFinalScore: '3',
      finalScore: '',
    },
    {
      id: users[6].id,
      userAlias: 'alias7',
      avatarPath: users[6].avatarUrl,
      quarterFinalScore: '4',
      semiFinalScore: '',
      finalScore: '',
    },
    {
      id: users[7].id,
      userAlias: 'alias8',
      avatarPath: users[7].avatarUrl,
      quarterFinalScore: '1',
      semiFinalScore: '',
      finalScore: '',
    },
  ];
  return tournamentData;
}
