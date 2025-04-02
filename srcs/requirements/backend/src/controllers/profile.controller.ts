import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';

interface ProfileUpdate {
  name?: string;
  bio?: string;
}

export async function getAllProfiles(request: FastifyRequest, reply: FastifyReply) {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        friends: true,
      },
    });
    reply.send(profiles);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getProfileById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const profile = await prisma.profile.findUniqueOrThrow({
      where: { id: request.params.id },
      include: {
        friends: true,
      },
    });
    reply.send(profile);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateProfile(
  request: FastifyRequest<{ Params: IParams; Body: ProfileUpdate }>,
  reply: FastifyReply,
) {
  try {
    const profile = await prisma.profile.update({
      where: { id: request.params.id },
      data: request.body,
    });
    reply.send(profile);
  } catch (error) {
    handleError(error, reply);
  }
}
