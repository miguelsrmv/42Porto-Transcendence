import { tournamentPlayer } from '../../ws/remoteGameApp/types';
import { prisma } from '../../utils/prisma';

// TODO: create tournament_status type data
export function processTournamentData(data: string[], scores: number[]) {
  if (data.length !== 15 && scores.length !== 14) return;
  console.log(`Scores: ${scores}`);
  const firstRoundScores = scores.slice(0, 8);
  const secondRoundScores = scores.slice(8, 12);
  const thirdRoundScores = scores.slice(12);
  console.log(`First round scores: ${firstRoundScores}`);
  console.log(`Second round scores: ${secondRoundScores}`);
  console.log(`Third round scores: ${thirdRoundScores}`);
  const playerData = data.slice(0, -1).flatMap((p) => {
    return {
      id: p[0],
      userAlias: p[1],
      avatarPath: '',
      quarterFinalScore: '',
      semiFinalScore: '',
      finalScore: '',
    };
  });
  for (let index = 0; index < firstRoundScores.length; index++) {
    playerData[index].quarterFinalScore = firstRoundScores[index].toString();
  }
  for (let index = 0; index < secondRoundScores.length; index++) {
    playerData[index + 8].semiFinalScore = secondRoundScores[index].toString();
  }
  for (let index = 0; index < thirdRoundScores.length; index++) {
    playerData[index + 12].finalScore = thirdRoundScores[index].toString();
  }
  console.log(`Players: ${JSON.stringify(playerData)}`);
}

export async function getTotalTournaments(playerId: string) {
  const tournaments = await prisma.tournamentParticipant.findMany({
    where: { userId: playerId },
    select: { tournamentId: true },
  });
  return tournaments.length;
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
