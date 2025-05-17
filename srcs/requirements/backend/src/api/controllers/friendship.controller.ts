import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { FriendshipStatus } from '@prisma/client';

export type FriendCreate = {
  friendId: string;
};

export type FriendUpdate = {
  friendId: string;
  status: FriendshipStatus;
};

export async function getUserFriends(request: FastifyRequest, reply: FastifyReply) {
  try {
    // TODO: Uncomment later
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ initiatorId: request.user.id }, { recipientId: request.user.id }],
        AND: { status: FriendshipStatus.ACCEPTED },
      },
      orderBy: { updatedAt: 'desc' },
      select: { initiatorId: true, recipientId: true },
    });
    const friendIds = friends.map((friend) =>
      friend.initiatorId === request.user.id ? friend.recipientId : friend.initiatorId,
    );
    reply.send(friendIds);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserPendingFriends(request: FastifyRequest, reply: FastifyReply) {
  try {
    const pendingFriends = await prisma.friendship.findMany({
      where: {
        recipientId: request.user.id,
        AND: { status: FriendshipStatus.PENDING },
      },
      select: { initiatorId: true },
    });
    reply.send(pendingFriends);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function addFriend(
  request: FastifyRequest<{ Body: FriendCreate }>,
  reply: FastifyReply,
) {
  try {
    const { friendId } = request.body;

    if (request.user.id === friendId)
      return reply.status(400).send('A user cannot befriend itself');
    await prisma.friendship.create({
      data: {
        initiatorId: request.user.id,
        recipientId: friendId,
      },
    });
    reply.send({ message: 'Friendship created' });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateFriendshipStatus(
  request: FastifyRequest<{ Body: FriendUpdate }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.id;
    const { friendId } = request.body;
    const { status } = request.body;

    await prisma.friendship.update({
      where: {
        initiatorId_recipientId: {
          initiatorId: friendId,
          recipientId: userId,
        },
      },
      data: {
        status: status,
      },
    });
    reply.send({ message: 'Friendship status updated' });
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

    await prisma.friendship.delete({
      where: {
        initiatorId_recipientId: {
          initiatorId: request.user.id,
          recipientId: id,
        },
      },
    });
    reply.send({ message: 'Friendship deleted' });
  } catch (error) {
    handleError(error, reply);
  }
}
