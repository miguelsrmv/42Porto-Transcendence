// import { test, expect, describe, beforeAll, afterAll } from 'vitest';
// import app from '../src/app';
// import { prisma } from '../src/utils/prisma';

let jwtCookie: string;
let jwtCookie2: string;
let jwtCookie3: string;

// test("GET / should return 'greetings Welcome to the ft_transcendence API'", async () => {
//   const response = await app.inject({
//     method: 'GET',
//     url: '/',
//   });

//   expect(response.statusCode).toBe(200);
//   expect(response.json()).toEqual({
//     greetings: 'Welcome to the ft_transcendence API',
//   });
// });

// beforeAll(async () => {
//   // Ensure the database is clean and insert test users
//   await prisma.user.deleteMany();
//   const testUser = await prisma.user.create({
//     data: {
//       username: 'alice23',
//       email: 'alice@example.com',
//       hashedPassword: 'hashed_password_1',
//     },
//   });
//   await prisma.user.create({
//     data: {
//       username: 'bob45',
//       email: 'bob@example.com',
//       hashedPassword: 'hashed_password_2',
//     },
//   });
//   await prisma.user.create({
//     data: {
//       username: 'susan43',
//       email: 'susan@example.com',
//       hashedPassword: 'hashed_password_3',
//     },
//   });
//   await app.ready();
//   const token = app.jwt.sign({
//     id: testUser.id,
//     username: testUser.username,
//     email: testUser.email,
//   });
//   jwtCookie = `access_token=${token}; HttpOnly; Path=/; Secure`;
// });

// afterAll(async () => {
//   await prisma.$disconnect();
// });

// describe('users routes', () => {
//   // TODO: Add protected routes testing logic
//   test('GET / should return 200 and an array of users', async () => {
//     const response = await app.inject({
//       method: 'GET',
//       url: '/users',
//       headers: {
//         cookie: jwtCookie,
//       },
//     });

//     expect(response.statusCode).toBe(200);
//     expect(response.json()).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           username: expect.any(String),
//           email: expect.any(String),
//           hashedPassword: expect.any(String),
//           salt: expect.any(String),
//         }),
//       ]),
//     );
//   });

//   test('POST / should return 200 and a new user', async () => {
//     const response = await app.inject({
//       method: 'POST',
//       url: '/users',
//       headers: { 'Content-Type': 'application/json' },
//       body: {
//         username: 'newUser',
//         email: 'newUser@email.com',
//         password: '123441',
//         repeatPassword: '123441',
//       },
//     });
//     expect(response.statusCode).toBe(200);
//     expect(JSON.parse(response.body)).toEqual(
//       expect.objectContaining({
//         id: expect.any(String),
//         createdAt: expect.any(String),
//         username: expect.any(String),
//         email: expect.any(String),
//         hashedPassword: expect.any(String),
//         salt: expect.any(String),
//       }),
//     );
//   });

//   test('POST /login should return 200 and JWT', async () => {
//     const response = await app.inject({
//       method: 'POST',
//       url: '/users/login',
//       headers: { 'Content-Type': 'application/json' },
//       body: { email: 'bob@example.com', password: 'hashed_password_2' },
//     });
//     expect(response.statusCode).toBe(200);
//     expect(JSON.parse(response.body)).toEqual(
//       expect.objectContaining({
//         avatar: expect.any(String),
//       }),
//     );
//   });

//   test('POST /login with wrong details should return 401 and message', async () => {
//     const response = await app.inject({
//       method: 'POST',
//       url: '/users/login',
//       headers: { 'Content-Type': 'application/json' },
//       body: { email: 'bob@example.com', password: 'hashed_password_1' },
//     });
//     expect(response.statusCode).toBe(401);
//     expect(JSON.parse(response.body)).toEqual(
//       expect.objectContaining({
//         message: expect.any(String),
//       }),
//     );
//   });

//   test('GET /:id should return 200 and a specific user', async () => {
//     const user = await prisma.user.findFirst({ where: { username: 'alice23' } });
//     const response = await app.inject({
//       method: 'GET',
//       url: '/users/' + user?.id,
//       headers: {
//         cookie: jwtCookie,
//       },
//     });

  //   expect(response.statusCode).toBe(200);
  //   expect(response.json()).toEqual(
  //     expect.objectContaining({
  //       username: user!.username,
  //       avatarUrl: user!.avatarUrl,
  //       lastActiveAt: expect.any(String),
  //       rank: expect.any(Number),
  //     }),
  //   );
  // });

//   // TODO: Add oldPassword to body
//   // test('PATCH / should return 200 and an updated user', async () => {
//   //   const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
//   //   const response = await app.inject({
//   //     method: 'PATCH',
//   //     url: '/users/',
//   //     headers: { 'Content-Type': 'application/json', cookie: jwtCookie },
//   //     body: { username: 'modified', email: 'modified@gmail.com' },
//   //   });

//   //   expect(response.statusCode).toBe(200);
//   //   expect(response.json()).toEqual(
//   //     expect.objectContaining({
//   //       id: user!.id,
//   //       createdAt: expect.any(String),
//   //       username: 'modified',
//   //       email: 'modified@gmail.com',
//   //       hashedPassword: user!.hashedPassword,
//   //       salt: user!.salt,
//   //     }),
//   //   );
//   // });

//   test('DELETE /:id should return 200 and the deleted user', async () => {
//     const user = await prisma.user.findFirst({ where: { username: 'alice23' } });
//     const response = await app.inject({
//       method: 'DELETE',
//       url: '/users/' + user?.id,
//       headers: {
//         cookie: jwtCookie,
//       },
//     });

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
    expect(response.json()).toEqual(false);
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

  test('DELETE /:id should return 200 and the deleted user', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'alice23' } });
    const response = await app.inject({
      method: 'DELETE',
      url: '/users/' + user?.id,
      headers: {
        cookie: jwtCookie,
      },
    });

    const deletedUser = await prisma.user.findUnique({ where: { username: 'alice23' } });

    expect(response.statusCode).toBe(200);
    expect(deletedUser).toEqual(null);
    expect(response.json()).toEqual(
      expect.objectContaining({
        username: user!.username,
        email: user!.email,
      }),
    );
  });

  test('POST /preLogin should return 200 and false', async () => {
    const user = await prisma.user.findUnique({ where: { username: 'bob45' } });
    const response = await app.inject({
      method: 'POST',
      url: '/users/preLogin',
      headers: { 'Content-Type': 'application/json' },
      body: { email: user?.email, password: 'hashed_password_2' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ enabled2FA: false });
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
