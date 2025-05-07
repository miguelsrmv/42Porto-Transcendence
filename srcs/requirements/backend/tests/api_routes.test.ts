import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

let jwtCookie: string;

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

beforeAll(async () => {
  // Ensure the database is clean and insert test users
  await prisma.user.deleteMany();
  await prisma.player.deleteMany();
  const testUser = await prisma.user.create({
    data: {
      username: 'alice23',
      email: 'alice@example.com',
      hashedPassword: 'hashed_password_1',
    },
  });
  await prisma.user.create({
    data: {
      username: 'bob45',
      email: 'bob@example.com',
      hashedPassword: 'hashed_password_2',
    },
  });
  await prisma.user.create({
    data: {
      username: 'susan43',
      email: 'susan@example.com',
      hashedPassword: 'hashed_password_3',
    },
  });
  await app.ready();
  const token = app.jwt.sign({
    id: testUser.id,
    username: testUser.username,
    email: testUser.email,
  });
  jwtCookie = `access_token=${token}; HttpOnly; Path=/; Secure`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('users routes', () => {
  // TODO: Add protected routes testing logic
  test('GET / should return 200 and an array of users', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: expect.any(String),
          email: expect.any(String),
          hashedPassword: expect.any(String),
          salt: expect.any(String),
          player: expect.objectContaining({
            name: expect.any(String),
            bio: expect.any(String),
            avatarUrl: expect.any(String),
          }),
        }),
      ]),
    );
  });

  test('POST / should return 200 and a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      headers: { 'Content-Type': 'application/json' },
      body: {
        username: 'newUser',
        email: 'newUser@email.com',
        password: '123441',
        repeatPassword: '123441',
      },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        hashedPassword: expect.any(String),
        salt: expect.any(String),
      }),
    );
  });

  test('POST /login should return 200 and JWT', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'bob@example.com', password: 'hashed_password_2' },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
  });

  test('POST /login with wrong details should return 401 and message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'bob@example.com', password: 'hashed_password_1' },
    });
    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      }),
    );
  });

  test('GET /:id should return 200 and a specific user', async () => {
    const user = await prisma.user.findFirst({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'GET',
      url: '/users/' + user?.id,
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: user!.id,
        createdAt: expect.any(String),
        username: user!.username,
        email: user!.email,
        hashedPassword: user!.hashedPassword,
        salt: user!.salt,
      }),
    );
  });

  test('PATCH /:id should return 200 and an updated user', async () => {
    const user = await prisma.user.findFirst({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'PATCH',
      url: '/users/' + user?.id,
      headers: { 'Content-Type': 'application/json', cookie: jwtCookie },
      body: { username: 'modified', email: 'modified@gmail.com' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: user!.id,
        createdAt: expect.any(String),
        username: 'modified',
        email: 'modified@gmail.com',
        hashedPassword: user!.hashedPassword,
        salt: user!.salt,
      }),
    );
  });

  test('DELETE /:id should return 200 and the deleted user', async () => {
    const user = await prisma.user.findFirst({ where: { username: 'modified' } });
    const response = await app.inject({
      method: 'DELETE',
      url: '/users/' + user?.id,
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: user!.id,
        createdAt: expect.any(String),
        username: user!.username,
        email: user!.email,
        hashedPassword: user!.hashedPassword,
        salt: user!.salt,
      }),
    );
  });
});

describe('players routes', () => {
  test('GET / should return 200 and an array of players', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/players',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          bio: expect.any(String),
          avatarUrl: expect.any(String),
        }),
      ]),
    );
  });

  test('GET /:id should return 200 and a specific player', async () => {
    const player = await prisma.player.findFirst({ where: { name: 'susan43' } });
    const response = await app.inject({
      method: 'GET',
      url: '/players/' + player?.id,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: player!.id,
        name: player!.name,
        bio: player!.bio,
        avatarUrl: player!.avatarUrl,
      }),
    );
  });

  test('PATCH /:id should return 200 and an updated player', async () => {
    const player = await prisma.player.findFirst({ where: { name: 'susan43' } });
    const response = await app.inject({
      method: 'PATCH',
      url: '/players/' + player?.id,
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'modified', bio: 'Changed bio' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: player!.id,
        name: 'modified',
        bio: 'Changed bio',
        avatarUrl: player!.avatarUrl,
      }),
    );
  });
});
