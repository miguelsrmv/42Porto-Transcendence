import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";
import { hashPassword } from "../utils/hash";

interface IParams {
  id: string;
}

interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export async function getAllUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const users = await prisma.user.findMany();
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
}

export async function getUserById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply
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
  reply: FastifyReply
) {
  try {
    const user = await prisma.user.create({
      data: {
        name: request.body.name,
        email: request.body.email,
        hashedPassword: request.body.password,
      },
    });
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}
