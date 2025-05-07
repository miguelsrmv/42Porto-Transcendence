import { prisma } from '../src/utils/prisma';

async function main() {
  try {
    if (await prisma.user.findMany()) console.log('Database up and running!');
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
