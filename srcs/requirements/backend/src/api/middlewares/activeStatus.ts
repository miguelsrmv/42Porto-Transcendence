import { FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';

export async function setLastActiveAt(request: FastifyRequest) {
  if (!request.user || !request.user.id) return;
  // Update last active timestamp for the user
  await prisma.user.update({
    where: { id: request.user.id },
    data: { lastActiveAt: new Date() },
  });
}
