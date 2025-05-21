import { Character, FriendshipStatus, GameMode, User } from '@prisma/client';
import { prisma } from '../src/utils/prisma';
import { faker } from '@faker-js/faker';
import { getRandomAvatarPath } from './avatarData';

const NUMBER_OF_USERS = 16;

const CHARACTERS = [
  'MARIO',
  'LINK',
  'PIKACHU',
  'SONIC',
  'KIRBY',
  'YOSHI',
  'DK',
  'MEWTWO',
  'BOWSER',
  'SAMUS',
  'CAPFALCON',
  'SNAKE',
];

// Test users
const USERNAME = 'ana123';
const EMAIL = 'ana123@example.com';
const TEST_PASSWORD = '123456789';

const USERNAME2 = 'chris123';
const EMAIL2 = 'chris123@example.com';
const TEST_PASSWORD2 = '123456789';

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
        avatarUrl: getRandomAvatarPath(),
      },
    });
  }
  await prisma.user.create({
    data: {
      username: USERNAME,
      email: EMAIL,
      hashedPassword: TEST_PASSWORD,
      avatarUrl: getRandomAvatarPath(),
    },
  });
  await prisma.user.create({
    data: {
      username: USERNAME2,
      email: EMAIL2,
      hashedPassword: TEST_PASSWORD2,
      avatarUrl: getRandomAvatarPath(),
    },
  });
}

async function createFriends(users: User[]) {
  await prisma.friendship.deleteMany();
  for (let index = 0; index < users.length / 2; index++) {
    const user = users[index];
    const recipientId = users[(index + 1) % users.length].id;
    const friendship = await prisma.friendship.create({
      data: {
        initiatorId: user.id,
        recipientId: recipientId,
      },
    });
    if (Math.random() < 0.5) {
      await prisma.friendship.update({
        where: { id: friendship.id },
        data: { status: FriendshipStatus.ACCEPTED },
      });
    }
    const testUser = await prisma.user.findUnique({ where: { username: USERNAME } });
    const testFriendship = await prisma.friendship.create({
      data: {
        initiatorId: user.id,
        recipientId: testUser!.id,
      },
    });
    if (Math.random() < 0.5) {
      await prisma.friendship.update({
        where: { id: testFriendship.id },
        data: { status: FriendshipStatus.ACCEPTED },
      });
    }
  }
  for (let index = users.length / 2; index < users.length; index++) {
    const user = users[index];
    const recipientId = users[(index + 1) % users.length].id;
    const friendship = await prisma.friendship.create({
      data: {
        initiatorId: recipientId,
        recipientId: user.id,
      },
    });
    if (Math.random() < 0.5) {
      await prisma.friendship.update({
        where: { id: friendship.id },
        data: { status: FriendshipStatus.ACCEPTED },
      });
    }
  }
}

async function createMatches(users: User[]) {
  await prisma.match.deleteMany();
  const matchSize = 2;
  for (let i = 0; i < users.length; i += matchSize) {
    const participants = users.slice(i, i + matchSize);
    if (participants.length === matchSize) {
      let score1 = Math.round(Math.random() * 5);
      let score2 = Math.round(Math.random() * 5);
      if (score1 === score2) --score1;
      if (score1 > score2) score1 = 5;
      else score2 = 5;
      const match = await prisma.match.create({
        data: {
          settings: '',
          user1Id: participants[0].id,
          user2Id: participants[1].id,
          user1Score: score1,
          user2Score: score2,
          user1Character: Character.NONE,
          user2Character: Character.NONE,
          winnerId: score1 > score2 ? participants[0].id : participants[1].id,
        },
      });
      if (Math.random() <= 0.5) {
        await prisma.match.update({
          where: { id: match.id },
          data: {
            mode: GameMode.CRAZY,
            user1Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
            user2Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
          },
        });
      }
      const winner = score1 > score2 ? participants[0].id : participants[1].id;
      const loser = score1 > score2 ? participants[1].id : participants[0].id;
      await prisma.leaderboard.update({
        where: { userId: winner },
        data: { score: { increment: 3 } },
      });
      const losingPlayerRecord = await prisma.leaderboard.findUnique({
        where: { userId: loser },
      });
      if (losingPlayerRecord && losingPlayerRecord.score > 0) {
        await prisma.leaderboard.update({
          where: { userId: loser },
          data: { score: { decrement: 1 } },
        });
      }
    }
  }
}

async function createTestUserMatches(users: User[]) {
  const testUser = await prisma.user.findUnique({ where: { username: USERNAME } });
  for (let i = 0; i < users.length; i += 1) {
    if (users[i].id === testUser!.id) continue;
    let score1 = Math.round(Math.random() * 5);
    let score2 = Math.round(Math.random() * 5);
    if (score1 === score2) --score1;
    if (score1 > score2) score1 = 5;
    else score2 = 5;
    await prisma.match.create({
      data: {
        settings: '',
        user1Id: testUser!.id,
        user2Id: users[i].id,
        user1Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
        user2Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
        user1Score: score1,
        user2Score: score2,
        winnerId: score1 > score2 ? testUser!.id : users[i].id,
        mode: GameMode.CRAZY,
      },
    });
    const winner = score1 > score2 ? testUser!.id : users[i].id;
    const loser = score1 > score2 ? users[i].id : testUser!.id;
    await prisma.leaderboard.update({
      where: { userId: winner },
      data: { score: { increment: 3 } },
    });
    const losingPlayerRecord = await prisma.leaderboard.findUnique({
      where: { userId: loser },
    });
    if (losingPlayerRecord && losingPlayerRecord.score > 0) {
      await prisma.leaderboard.update({
        where: { userId: loser },
        data: { score: { decrement: 1 } },
      });
    }
  }
}

async function main() {
  try {
    await seedUsers();
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    await createFriends(users);
    await createMatches(users);
    await createTestUserMatches(users);
    if (await prisma.user.findMany()) console.log('Database populated successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
