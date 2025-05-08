import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { verifyPassword } from '../../utils/hash';
import { handleError } from '../../utils/errorHandler';
import { getUserClassicStats, getUserCrazyStats } from '../services/user.services';

export type UserCreate = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

type UserLogin = {
  email: string;
  password: string;
};

export type UserUpdate = {
  username?: string;
  email?: string;
};

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany();
    reply.send(users);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const loggedInUserId = request.user.id;

    if (loggedInUserId !== request.params.id) reply.status(401).send({ message: 'Unauthorized' });
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.params.id },
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function createUser(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  try {
    const user = await prisma.user.create({
      data: {
        username: request.body.username,
        email: request.body.email,
        hashedPassword: request.body.password,
      },
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateUser(
  request: FastifyRequest<{ Params: IParams; Body: UserUpdate }>,
  reply: FastifyReply,
) {
  try {
    if (request.user.id !== request.params.id) reply.status(401).send({ message: 'Unauthorized' });
    const user = await prisma.user.update({
      where: { id: request.params.id },
      data: request.body,
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function deleteUser(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    if (request.user.id !== request.params.id) reply.status(401).send({ message: 'Unauthorized' });
    const user = await prisma.user.delete({
      where: { id: request.params.id },
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function login(request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: request.body.email },
      select: { id: true, username: true, email: true, hashedPassword: true, salt: true },
    });

    const isMatch = verifyPassword({
      candidatePassword: request.body.password,
      hash: user.hashedPassword,
      salt: user.salt,
    });

    if (!isMatch) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      userName: user.username,
    });

    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 60, // Valid for 2h
    });
    reply.send({ token });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function checkLoginStatus(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.access_token;
  if (token) reply.send('User is logged in');
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token');
  reply.send({ message: 'Logout successful!' });
}

export async function getOwnUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user.id;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, username: true, email: true },
    });

    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserStats(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const userMatches = await prisma.match.findMany({
      where: { OR: [{ user1Id: request.params.id }, { user2Id: request.params.id }] },
    });
    const stats = {
      classic: getUserClassicStats(userMatches, request.params.id),
      crazy: getUserCrazyStats(userMatches, request.params.id),
    };

    reply.send({ stats });
  } catch (error) {
    handleError(error, reply);
  }
}
