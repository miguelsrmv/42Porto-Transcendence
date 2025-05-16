import { Character, FriendshipStatus, MatchMode, User } from '@prisma/client';
import { prisma } from '../src/utils/prisma';
import { faker } from '@faker-js/faker';

const NUMBER_OF_USERS = 16;

const CHARACTERS = [
  'NONE',
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
      },
    });
  }
  await prisma.user.create({
    data: {
      username: USERNAME,
      email: EMAIL,
      hashedPassword: TEST_PASSWORD,
    },
  });
  await prisma.user.create({
    data: {
      username: USERNAME2,
      email: EMAIL2,
      hashedPassword: TEST_PASSWORD2,
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
    await prisma.friendship.create({
      data: {
        initiatorId: user.id,
        recipientId: testUser!.id,
      },
    });
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

async function createTournaments(users: User[]) {
  await prisma.tournament.deleteMany();
  const tournamentSize = 4;
  for (let i = 0; i < users.length; i += tournamentSize) {
    const participants = users.slice(i, i + tournamentSize);
    if (participants.length === tournamentSize) {
      const tournament = await prisma.tournament.create({
        data: {
          name: `Tournament ${Math.floor(i / tournamentSize) + 1}`,
          maxParticipants: tournamentSize,
          settings: '',
          createdBy: {
            connect: { id: users[i].id },
          },
        },
      });
      for (let j = 0; j < tournamentSize; j += 1) {
        await prisma.tournamentParticipant.create({
          data: {
            alias: faker.internet.username(),
            tournamentId: tournament.id,
            userId: users[j].id,
          },
        });
      }
    }
  }
}

async function createMatches(users: User[]) {
  await prisma.match.deleteMany();
  const matchSize = 2;
  for (let i = 0; i < users.length; i += matchSize) {
    const participants = users.slice(i, i + matchSize);
    if (participants.length === matchSize) {
      const match = await prisma.match.create({
        data: {
          settings: '',
          user1Id: participants[0].id,
          user2Id: participants[1].id,
          user1Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
          user2Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
        },
      });
      if (Math.random() < 0.5) {
        await prisma.match.update({
          where: { id: match.id },
          data: {
            mode: MatchMode.CRAZY,
          },
        });
      }
      if (Math.random() < 0.5) {
        await prisma.match.update({
          where: { id: match.id },
          data: {
            winnerId: participants[0].id,
          },
        });
      }
    }
  }
}

async function createTestUserMatches(users: User[]) {
  const testUser = await prisma.user.findUnique({ where: { username: USERNAME } });
  for (let i = 0; i < users.length; i += 1) {
    if (users[i].id === testUser!.id) continue;
    const match = await prisma.match.create({
      data: {
        settings: '',
        user1Id: testUser!.id,
        user2Id: users[i].id,
        user1Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
        user2Character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] as Character,
        user1Score: Math.round(Math.random() * 5),
        user2Score: Math.round(Math.random() * 5),
        mode: MatchMode.CRAZY,
      },
    });
    if (match.user1Score > match.user2Score) {
      await prisma.match.update({
        where: { id: match.id },
        data: {
          winnerId: testUser!.id,
        },
      });
    } else if (match.user1Score < match.user2Score) {
      await prisma.match.update({
        where: { id: match.id },
        data: {
          winnerId: users[i].id,
        },
      });
    }
  }
}

async function generateLeaderboard(users: User[]) {
  for (let index = 0; index < users.length; index++) {
    await prisma.leaderboard.update({
      where: { userId: users[index].id },
      data: {
        score: Math.random() * 1000,
      },
    });
  }
}

async function main() {
  try {
    await seedUsers();
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    await createFriends(users);
    await createTournaments(users);
    await createMatches(users);
    await createTestUserMatches(users);
    await generateLeaderboard(users);
    if (await prisma.user.findMany()) console.log('Database populated successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    prisma.$disconnect();
  }
}

main();
