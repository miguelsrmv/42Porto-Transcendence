import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { verifyPassword } from '../utils/hash';

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
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
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
    reply.status(500).send(error);
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
    reply.status(500).send(error);
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
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
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
    reply.status(500).send(error);
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
    reply.status(500).send({ message: 'An error occurred', error });
  }
}
