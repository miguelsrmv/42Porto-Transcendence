import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/prisma";

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

interface IParams {
  id: string;
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
