/* Script to interact with the database */
import { prisma } from "../src/utils/prisma";
import { faker } from "@faker-js/faker";

async function seedUsers() {
  await prisma.user.deleteMany();
  for (let index = 0; index < 4; index++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
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
