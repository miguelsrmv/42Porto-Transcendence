/* Script to interact with the database */
import { prisma } from "../src/utils/prisma";
import { hashPassword } from "../src/utils/hash";
import { faker } from "@faker-js/faker";

// Change according to the test
async function test() {
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: {
      name: "Kyle",
      email: "kyle23@email.com",
      hashedPassword: faker.internet.password(),
    },
  });
  console.log(user);
}

async function main() {
  try {
    await test();
    console.log(await prisma.user.findMany());
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
