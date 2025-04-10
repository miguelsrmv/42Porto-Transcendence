/* Script to interact with the database */
import { Player } from '@prisma/client';
import { prisma } from '../src/utils/prisma';
import { faker } from '@faker-js/faker';

const NUMBER_OF_USERS = 16;

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
      await prisma.tournament.create({
        data: {
          name: `Tournament ${Math.floor(i / tournamentSize) + 1}`,
          maxParticipants: tournamentSize,
          settings: '',
          createdBy: {
            connect: { id: players[i].id },
          },
        },
      });
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

async function main() {
  try {
    await seedUsers();
    const players = await prisma.player.findMany();
    await createFriends(players);
    await createTournaments(players);
    await createMatches(players);
    if (await prisma.user.findMany({ include: { player: true } }))
      console.log('Database populated successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
