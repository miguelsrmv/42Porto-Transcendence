import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';
import { FriendStatus } from '@prisma/client';

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
        OR: [{ profileId: request.params.id }, { friendId: request.params.id }],
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

export async function updateFriend(
  request: FastifyRequest<{ Params: IParams; Body: { status: FriendStatus } }>,
  reply: FastifyReply,
) {
  try {
    // Friend id
    const { id } = request.params;
    const { status } = request.body;

    const friend = await prisma.friend.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    reply.send(friend);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function deleteFriend(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;

    const friend = await prisma.friend.delete({
      where: {
        id: id,
      },
    });
    reply.send(friend);
  } catch (error) {
    handleError(error, reply);
  }
}
