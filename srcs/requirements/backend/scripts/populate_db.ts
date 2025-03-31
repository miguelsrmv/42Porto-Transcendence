/* Script to interact with the database */
import { Profile } from '@prisma/client';
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

async function createFriends(profiles: Profile[]) {
  for (let index = 0; index < profiles.length; index++) {
    const profile = profiles[index];
    const friendId = profiles[(index + 1) % profiles.length].id;
    await prisma.friend.create({
      data: {
        profileId: profile.id,
        friendId: friendId,
      },
    });
  }
}

async function main() {
  try {
    await seedUsers();
    const profiles = await prisma.profile.findMany();
    await createFriends(profiles);
    console.log(await prisma.user.findMany({ include: { profile: true } }));
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
