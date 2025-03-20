/* Script to interact with the database */
import { prisma } from '../src/utils/prisma';
import { faker } from '@faker-js/faker';

const NUMBER_OF_USERS = 4;

async function seedUsers() {
  await prisma.user.deleteMany();
  for (let index = 0; index < NUMBER_OF_USERS; index++) {
    await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        hashedPassword: faker.internet.password(),
      },
    });
  }
}

async function main() {
  try {
    await seedUsers();
    console.log(await prisma.user.findMany());
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
