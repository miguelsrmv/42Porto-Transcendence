import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';

interface FriendCreate {
  profileId: string;
  friendId: string;
}

export async function getAllFriends(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const friends = await prisma.friend.findMany({
      where: {
        profileId: request.params.id,
      },
    });
    reply.send(friends);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function createFriend(
  request: FastifyRequest<{ Body: FriendCreate }>,
  reply: FastifyReply,
) {
  try {
    const { profileId } = request.body;
    const { friendId } = request.body;

    const friend = await prisma.friend.create({
      data: {
        profileId: profileId,
        friendId,
      },
    });
    reply.send(friend);
  } catch (error) {
    handleError(error, reply);
  }
}
