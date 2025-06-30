import { FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';

//TODO: Handle other error cases
export function handleError(error: unknown, request: FastifyRequest, reply: FastifyReply) {
  reply.log.error(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    error.message = error.message.split('\n').pop()?.trim() || 'An unexpected error occurred';
    if (error.code === 'P2025') {
      return reply.status(404).send(error);
    }
    return reply.status(400).send(error);
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    error.message = error.message.split('\n').pop()?.trim() || 'An unexpected error occurred';
    return reply.status(400).send(error);
  }
  if (error instanceof TypeError) return reply.status(400).send(error);
  return reply.status(500).send(error);
}
