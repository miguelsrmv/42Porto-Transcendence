import { prisma } from '../src/utils/prisma';
const NUMBER_OF_USERS = 1;

async function seedUsers() {
  await prisma.user.deleteMany();
  for (let index = 0; index < NUMBER_OF_USERS; index++) {
    const username = 'ana123';
    const email = `ana123@example.com`;
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        hashedPassword: '123456789',
      },
    });
  }
}

async function main() {
  try {
    await seedUsers();
    if (await prisma.user.findMany({ include: { player: true } }))
      console.log('Database populated successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
