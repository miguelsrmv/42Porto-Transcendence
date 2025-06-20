import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import { randomUUID } from 'crypto';

let jwtCookie: string;
let jwtCookie2: string;
let jwtCookie3: string;

const COOKIE_MAX_AGE = 2 * 60 * 60; // Valid for 2h

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
  try {
    const sessionId = randomUUID();
    const sessionExpires = new Date(Date.now() + 1000 * COOKIE_MAX_AGE);
    // Ensure the database is clean and insert test users
    await prisma.user.deleteMany();
    await prisma.friendship.deleteMany();
    const testUser = await prisma.user.create({
      data: {
        username: 'alice23',
        email: 'alice@example.com',
        hashedPassword: 'hashed_password_1',
        sessionToken: sessionId,
        sessionExpiresAt: sessionExpires,
      },
    });
    const testUser2 = await prisma.user.create({
      data: {
        username: 'bob45',
        email: 'bob@example.com',
        hashedPassword: 'hashed_password_2',
        sessionToken: sessionId,
        sessionExpiresAt: sessionExpires,
      },
    });
    const testUser3 = await prisma.user.create({
      data: {
        username: 'susan43',
        email: 'susan@example.com',
        hashedPassword: 'hashed_password_3',
        sessionToken: sessionId,
        sessionExpiresAt: sessionExpires,
      },
    });
    await prisma.user.create({
      data: {
        username: 'jack',
        email: 'jack@example.com',
        hashedPassword: 'hashed_password_4',
        sessionToken: sessionId,
        sessionExpiresAt: sessionExpires,
      },
    });
    await prisma.friendship.create({
      data: { initiatorId: testUser2.id, recipientId: testUser3.id },
    });
    await app.ready();
    const token = app.jwt.sign({
      id: testUser.id,
      username: testUser.username,
      email: testUser.email,
      sessionId: sessionId,
    });
    const token2 = app.jwt.sign({
      id: testUser2.id,
      username: testUser2.username,
      email: testUser2.email,
      sessionId: sessionId,
    });
    const token3 = app.jwt.sign({
      id: testUser3.id,
      username: testUser3.username,
      email: testUser3.email,
      sessionId: sessionId,
    });
    jwtCookie = `access_token=${token}; HttpOnly; Path=/; Secure`;
    jwtCookie2 = `access_token=${token2}; HttpOnly; Path=/; Secure`;
    jwtCookie3 = `access_token=${token3}; HttpOnly; Path=/; Secure`;
  } catch (err) {
    console.error(err);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('users', () => {
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

    const newUser = await prisma.user.findUnique({ where: { username: 'newUser' } });
    expect(response.statusCode).toBe(200);
    expect(newUser?.username).toEqual('newUser');
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
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

  test('GET /2FA/check should return 200 and a false', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/2FA/check',
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(false);
  });

  test('GET /getAvatarPath should return 200 and the avatar path', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'GET',
      url: '/users/getAvatarPath',
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ path: user?.avatarUrl });
  });

  test('GET /isOnline/:id should return 200 and a false', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'GET',
      url: '/users/isOnline/' + user?.id,
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(true);
  });

  test('GET /:id should return 200 and a specific user', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
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
        username: user!.username,
        avatarUrl: user!.avatarUrl,
        lastActiveAt: expect.any(String),
        rank: 1,
      }),
    );
  });

  test('GET /:id/stats should return 200 and a specific user stats', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'GET',
      url: '/users/' + user?.id + '/stats',
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        stats: expect.objectContaining({
          totalMatches: 0,
          wins: 0,
          losses: 0,
          points: 0,
          winRate: 0,
          rank: 1,
        }),
      }),
    );
  });

  test('GET /me should return 200 and a own user', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'GET',
      url: '/users/me',
      headers: {
        cookie: jwtCookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: user?.id,
        username: user!.username,
        email: user?.email,
        avatarUrl: user!.avatarUrl,
      }),
    );
  });

  test('PUT /defaultAvatar should return 200 and an updated user', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/users/defaultAvatar',
      headers: { 'Content-Type': 'application/json', cookie: jwtCookie },
      body: { path: 'newAvatarPath.png' },
    });

    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    expect(response.statusCode).toBe(200);
    expect(user?.avatarUrl).toEqual('newAvatarPath.png');
    expect(response.json()).toEqual(
      expect.objectContaining({ message: 'Path to avatar updated successfully.' }),
    );
  });

  test('PATCH / should return 200 and an updated user', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'PATCH',
      url: '/users',
      headers: { 'Content-Type': 'application/json', cookie: jwtCookie },
      body: { email: 'modified@gmail.com', oldPassword: 'hashed_password_1' },
    });

    const updatedUser = await prisma.user.findUnique({ where: { username: user?.username } });

    expect(response.statusCode).toBe(200);
    expect(updatedUser?.email).toEqual('modified@gmail.com');
    expect(response.json()).toEqual(
      expect.objectContaining({
        username: user?.username,
        email: 'modified@gmail.com',
      }),
    );
  });

  test('DELETE / should return 200 and the deleted user', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'DELETE',
      url: '/users',
      headers: {
        cookie: jwtCookie,
      },
      body: {
        password: 'hashed_password_1',
      },
    });

    const deletedUser = await prisma.user.findUnique({ where: { username: 'alice23' } });

    expect(response.statusCode).toBe(200);
    expect(deletedUser).toEqual(null);
    expect(response.json()).toEqual(
      expect.objectContaining({
        message: 'User deleted successfully',
      }),
    );
  });
});

describe('friends', () => {
  test('POST / should return 200 and an add a new friend', async () => {
    const friend = await prisma.user.findUnique({ where: { username: 'jack' } });
    const response = await app.inject({
      method: 'POST',
      url: '/friends',
      headers: {
        'Content-Type': 'application/json',
        cookie: jwtCookie2,
      },
      body: { friendId: friend?.id },
    });

    const user2 = await prisma.user.findUnique({ where: { username: 'bob45' } });
    const friendship = await prisma.friendship.findUnique({
      where: {
        initiatorId_recipientId: {
          initiatorId: user2!.id,
          recipientId: friend!.id,
        },
      },
    });
    expect(response.statusCode).toBe(200);
    expect(friendship).toEqual(
      expect.objectContaining({ initiatorId: user2!.id, recipientId: friend!.id }),
    );
    expect(response.json()).toEqual({ message: 'Friendship created' });
  });

  test('GET /pending should return 200 and an array of pending friends', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/friends/pending',
      headers: {
        cookie: jwtCookie3,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(expect.arrayContaining([{ initiatorId: expect.any(String) }]));
  });

  test('PATCH / should return 200 and update friendship status', async () => {
    const friend = await prisma.user.findUnique({ where: { username: 'bob45' } });
    const response = await app.inject({
      method: 'PATCH',
      url: '/friends',
      headers: {
        'Content-Type': 'application/json',
        cookie: jwtCookie3,
      },
      body: { friendId: friend?.id, status: 'ACCEPTED' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Friendship status updated' });
  });

  test('GET / should return 200 and an array of user friends ids', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/friends',
      headers: {
        cookie: jwtCookie3,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(expect.arrayContaining([expect.any(String)]));
  });

  test('DELETE /:id should return 200 and delete friendship', async () => {
    const friend = await prisma.user.findUnique({ where: { username: 'susan43' } });
    const response = await app.inject({
      method: 'DELETE',
      url: '/friends/' + friend?.id,
      headers: {
        cookie: jwtCookie2,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Friendship deleted' });
  });
});

describe('leaderboard', () => {
  test('GET / should return 200 and leaderboard', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/leaderboard',
      headers: {
        cookie: jwtCookie2,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          score: 0,
          userId: expect.any(String),
        }),
      ]),
    );
  });
});
