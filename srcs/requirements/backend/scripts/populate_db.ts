/* Script to interact with the database */
import { Player } from '@prisma/client';
import { prisma } from '../src/utils/prisma';
import { faker } from '@faker-js/faker';

const NUMBER_OF_USERS = 4;

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

async function main() {
  try {
    await seedUsers();
    const players = await prisma.player.findMany();
    await createFriends(players);
    console.log(await prisma.user.findMany({ include: { player: true } }));
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
