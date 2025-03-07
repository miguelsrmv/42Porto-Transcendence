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
