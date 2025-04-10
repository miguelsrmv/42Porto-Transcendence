/* Script to interact with the database */
import { MatchMode, Player } from '@prisma/client';
import { prisma } from '../src/utils/prisma';
import { faker } from '@faker-js/faker';

const NUMBER_OF_USERS = 16;

// This is the test user
const USERNAME = 'ana123';
const EMAIL = 'ana123@example.com';
const TEST_PASSWORD = '123456789';

async function seedUsers() {
  await prisma.user.deleteMany();
  for (let index = 0; index < NUMBER_OF_USERS; index++) {
    const username = faker.internet.username().replace(/\./g, '_');
    const email = `${username.toLowerCase()}@example.com`;
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        hashedPassword: faker.internet.password(),
      },
    });
  }
}

async function createFriends(players: Player[]) {
  for (let index = 0; index < players.length; index++) {
    const player = players[index];
    const friendId = players[(index + 1) % players.length].id;
    await prisma.friendship.create({
      data: {
        playerId: player.id,
        friendId: friendId,
      },
    });
  }
}

async function createTournaments(players: Player[]) {
  const tournamentSize = 4;
  for (let i = 0; i < players.length; i += tournamentSize) {
    const participants = players.slice(i, i + tournamentSize);
    if (participants.length === tournamentSize) {
      const tournament = await prisma.tournament.create({
        data: {
          name: `Tournament ${Math.floor(i / tournamentSize) + 1}`,
          maxParticipants: tournamentSize,
          settings: '',
          createdBy: {
            connect: { id: players[i].id },
          },
        },
      });
      for (let j = 0; j < tournamentSize; j += 1) {
        await prisma.tournamentParticipant.create({
          data: {
            alias: faker.internet.username(),
            tournamentId: tournament.id,
            playerId: players[j].id,
          },
        });
      }
    }
  }
}

async function createMatches(players: Player[]) {
  const matchSize = 2;
  for (let i = 0; i < players.length; i += matchSize) {
    const participants = players.slice(i, i + matchSize);
    if (participants.length === matchSize) {
      await prisma.match.create({
        data: {
          settings: '',
          player1Id: participants[0].id,
          player2Id: participants[1].id,
        },
      });
    }
  }
}

async function createTestUser(players: Player[]) {
  const testUser = await prisma.user.create({
    data: {
      username: USERNAME,
      email: EMAIL,
      hashedPassword: TEST_PASSWORD,
    },
    include: {
      player: true,
    },
  });
  for (let index = 0; index < players.length / 2; index++) {
    const friendId = players[(index + 1) % players.length].id;
    await prisma.friendship.create({
      data: {
        playerId: testUser.player!.id,
        friendId: friendId,
      },
    });
  }
  for (let i = 0; i < players.length; i += 1) {
    const match = await prisma.match.create({
      data: {
        settings: '',
        player1Id: testUser.player!.id,
        player2Id: players[i].id,
      },
    });
    if (Math.random() < 0.5) {
      await prisma.match.update({
        where: { id: match.id },
        data: {
          winnerId: testUser.player!.id,
        },
      });
    }
    if (Math.random() < 0.5) {
      await prisma.match.update({
        where: { id: match.id },
        data: {
          mode: MatchMode.CUSTOM,
        },
      });
    }
  }
}

async function main() {
  try {
    await seedUsers();
    const players = await prisma.player.findMany();
    await createFriends(players);
    await createTournaments(players);
    await createMatches(players);
    await createTestUser(players);
    if (await prisma.user.findMany({ include: { player: true } }))
      console.log('Database populated successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
