import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import app from '../../app';
import { handleError } from '../../utils/errorHandler';

export async function setLastActiveAt(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    app.log.info('This route is not protected');
    return;
  }
  try {
    // Update last active timestamp for the user
    await prisma.user.update({
      where: { id: request.user.id },
      data: { lastActiveAt: new Date() },
    });
  } catch (error) {
    handleError(error, reply);
  }
}
