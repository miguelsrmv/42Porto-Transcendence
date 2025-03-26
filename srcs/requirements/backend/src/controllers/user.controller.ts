import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { verifyPassword } from '../utils/hash';
import { handleError } from '../utils/errorHandler';

interface IParams {
  id: string;
}

interface UserCreate {
  username: string;
  email: string;
  password: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserUpdate {
  data: { username?: string; email?: string };
}

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    if (users.length === 0) {
      return reply.status(404).send({ message: 'No users found' });
    }
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
    const user = await prisma.user.update({
      where: { id: request.params.id },
      data: request.body.data,
    });
    if (!user) {
      return reply.status(400).send({ message: 'Unable to update user data' });
    }
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
      select: { username: true, email: true, hashedPassword: true, salt: true },
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
      payload: {
        email: user.email,
        userName: user.username,
      },
    });

    reply.send({ token });
  } catch (error) {
    handleError(error, reply);
  }
}
