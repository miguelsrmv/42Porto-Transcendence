/* Script to interact with the database */
import { prisma } from "../src/utils/prisma";
import { hashPassword } from "../src/utils/hash";
import { faker } from "@faker-js/faker";

// Change according to the test
async function test() {
  await prisma.user.deleteMany();
  const { hash, salt } = hashPassword(faker.internet.password());
  const user = await prisma.user.create({
    data: {
      name: "Kyle",
      email: "kyle23@email.com",
      hashedPassword: hash,
      salt: salt,
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
