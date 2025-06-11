import { prisma } from '../../utils/prisma';
import { tournamentPlayer } from '../../ws/remoteGameApp/types';
import { contractProvider } from './blockchain.services';

// TODO: create tournament_status type data
export async function processTournamentData(data: string[][], scores: number[]) {
  if (data.length !== 15 || scores.length !== 14) return;

  const firstRoundScores = scores.slice(0, 8);
  const secondRoundScores = scores.slice(8, 12);
  const thirdRoundScores = scores.slice(12);

  const rawPlayers = data.slice(0, -1).map((p, index) => {
    const [id, userAlias] = p;
    let quarterFinalScore = '';
    let semiFinalScore = '';
    let finalScore = '';

    if (index < 8) {
      quarterFinalScore = firstRoundScores[index].toString();
    } else if (index < 12) {
      semiFinalScore = secondRoundScores[index - 8].toString();
    } else if (index < 14) {
      finalScore = thirdRoundScores[index - 12].toString();
    }

    return {
      id,
      userAlias,
      avatarPath: '',
      quarterFinalScore,
      semiFinalScore,
      finalScore,
    };
  });

  const mergedPlayers: Record<string, (typeof rawPlayers)[0]> = {};

  for (const player of rawPlayers) {
    if (!mergedPlayers[player.id]) {
      mergedPlayers[player.id] = { ...player };
    } else {
      const existing = mergedPlayers[player.id];
      existing.quarterFinalScore ||= player.quarterFinalScore;
      existing.semiFinalScore ||= player.semiFinalScore;
      existing.finalScore ||= player.finalScore;
    }
  }

  const finalPlayers: tournamentPlayer[] = Object.values(mergedPlayers);
  for (const player of finalPlayers) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: player.id },
      select: { avatarUrl: true },
    });
    player.avatarPath = user.avatarUrl;
  }

  return finalPlayers;
}

export async function getTotalTournaments(playerId: string) {
  const tournaments = await prisma.tournamentParticipant.findMany({
    where: { userId: playerId },
    select: { tournamentId: true },
  });
  return tournaments.length;
}

export async function getWonTournaments(playerId: string) {
  const tournaments = await prisma.tournamentParticipant.findMany({
    where: { userId: playerId },
    select: { tournamentId: true },
  });
  let wonTournaments = 0;
  try {
    for (const tournament of tournaments) {
      const index = await contractProvider.findLastIndexOfPlayer(tournament.tournamentId, playerId);
      if (index == 14) wonTournaments++;
    }
  } catch (err) {
    console.error(err);
  }
  return wonTournaments;
}
