import { randomUUID } from 'crypto';
import { prisma } from '../src/utils/prisma';
import { PlayerTuple } from '../src/ws/remoteGameApp/types';
import { gameTypeToEnum, gameTypeToGameMode } from '../src/utils/helpers';
import { contractSigner, provider, wallet } from '../src/api/services/blockchain.services';

const CHARACTERS = [
  'MARIO',
  'LINK',
  'PIKACHU',
  'SONIC',
  'KIRBY',
  'YOSHI',
  'DK',
  'MEWTWO',
  'BOWSER',
  'SAMUS',
  'CAPFALCON',
  'SNAKE',
];

async function createTestUserTournament(users: string[]) {
  const tournamentId = randomUUID();
  const playerData: PlayerTuple[] = users.map((u): PlayerTuple => {
    return [u, 'test', CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]];
  });
  for (let i = 0; i < 8; i++) {
    playerData[i][1] = `test${i + 1}`;
  }
  const data = {
    tournamentId: tournamentId,
    gameType: gameTypeToEnum('Crazy Pong'),
    participants: playerData,
  };

  // Create tournament
  try {
    const currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
    const tx = await contractSigner.joinTournament(
      data.tournamentId,
      data.gameType,
      data.participants,
      {
        nonce: currentNonce,
      },
    );
    await tx.wait();
  } catch (err) {
    console.log(`Error in joinTournament Blockchain call: ${err}`);
  }

  // First round
  for (let i = 0; i < 8; i += 2) {
    try {
      const currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
      const tx = await contractSigner.saveScoreAndAddWinner(
        data.tournamentId,
        data.participants[i],
        5,
        data.participants[i + 1],
        3,
        {
          nonce: currentNonce,
        },
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error calling saveScoreAndAddWinner: ${err}`);
    }
  }

  // Second round
  for (let i = 0; i < 8; i += 4) {
    try {
      const currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
      const tx = await contractSigner.saveScoreAndAddWinner(
        data.tournamentId,
        data.participants[i],
        5,
        data.participants[i + 2],
        3,
        {
          nonce: currentNonce,
        },
      );
      await tx.wait();
    } catch (err) {
      console.log(`Error calling saveScoreAndAddWinner: ${err}`);
    }
  }

  // Last round
  try {
    const currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
    const tx = await contractSigner.saveScoreAndAddWinner(
      data.tournamentId,
      data.participants[0],
      5,
      data.participants[4],
      3,
      {
        nonce: currentNonce,
      },
    );
    await tx.wait();
  } catch (err) {
    console.log(`Error calling saveScoreAndAddWinner: ${err}`);
  }

  // Store tournament and participants ids in database
  await Promise.all(
    users.map((id) =>
      prisma.tournamentParticipant.create({
        data: {
          tournamentId: tournamentId,
          userId: id,
          tournamentType: gameTypeToGameMode('Crazy Pong'),
        },
      }),
    ),
  );

  // Update leaderboard
  // increments = [1, 3, 8];
  const scores: number[] = [12, 0, 1, 0, 4, 0, 1, 0];
  for (let i = 0; i < 8; i++) {
    if (scores[i] > 0) {
      await prisma.leaderboard.update({
        where: { userId: users[i] },
        data: { score: { increment: scores[i] } },
      });
    }
  }
}

async function getTestUsers() {
  const testUsersIds: string[] = [];
  for (let i = 0; i < 8; i++) {
    try {
      const user = await prisma.user.findUniqueOrThrow({ where: { username: `test${i + 1}` } });
      testUsersIds.push(user.id);
    } catch (err) {
      console.error(
        `Missing user: test${i + 1}. You must first populate the DB with npm run populate`,
      );
      throw err;
    }
  }
  return testUsersIds;
}

async function main() {
  try {
    const testUsersIds = await getTestUsers();
    await createTestUserTournament(testUsersIds);
    if (await prisma.tournamentParticipant.findMany())
      console.log('Tournament populated successfully.');
  } catch (e) {
    console.error('Error populating tournament:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Unhandled error in main:', err);
});
