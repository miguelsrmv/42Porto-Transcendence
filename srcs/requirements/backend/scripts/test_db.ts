import { prisma } from '../src/utils/prisma';

async function main() {
  try {
    if (await prisma.user.findMany()) console.log('Database up and running!');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Error in main():', err);
});
