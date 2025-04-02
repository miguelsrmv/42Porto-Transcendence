import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

// TODO: Add more complete tests for the API routes
test("GET / should return 'greetings Welcome to the ft_transcendence API'", async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({
    greetings: 'Welcome to the ft_transcendence API',
  });
});

describe('GET /users', () => {
  beforeAll(async () => {
    // Ensure the database is clean and insert test users
    await prisma.user.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.friendship.deleteMany();
    await Promise.all([
      // Using create since createMany does not support nested writes
      prisma.user.create({
        data: {
          username: 'alice23',
          email: 'alice@example.com',
          hashedPassword: 'hashed_password_1',
          profile: {
            create: {
              name: 'Alice',
              bio: 'Hello, I am Alice!',
            },
          },
        },
      }),
      prisma.user.create({
        data: {
          username: 'bob45',
          email: 'bob@example.com',
          hashedPassword: 'hashed_password_2',
          profile: {
            create: {
              name: 'Bob',
              bio: 'Hello, I am Bob!',
            },
          },
        },
      }),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should return 200 and an array of users', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: expect.any(String),
          email: expect.any(String),
          hashedPassword: expect.any(String),
          salt: expect.any(String),
          profile: expect.objectContaining({
            name: expect.any(String),
            bio: expect.any(String),
            avatarUrl: expect.any(String),
            expPoints: 0,
            wins: 0,
            losses: 0,
          }),
        }),
      ]),
    );
  });
});

test('GET /profiles should return 200', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/profiles',
  });

  expect(response.statusCode).toBe(200);
});
