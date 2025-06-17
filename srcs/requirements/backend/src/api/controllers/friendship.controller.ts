import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { FriendshipStatus } from '@prisma/client';
import { FriendCreate, FriendCreateUsername, FriendUpdate } from '../../types';

export async function getUserFriends(request: FastifyRequest, reply: FastifyReply) {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ initiatorId: request.user.id }, { recipientId: request.user.id }],
        status: FriendshipStatus.ACCEPTED,
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
        status: FriendshipStatus.PENDING,
      },
      select: { initiatorId: true },
    });
    reply.send(pendingFriends);
  } catch (error) {
    handleError(error, reply);
  }
}

// TODO: Review friendships (sender/recipient and opposite)
export async function addFriend(
  request: FastifyRequest<{ Body: FriendCreate }>,
  reply: FastifyReply,
) {
  try {
    const { friendId } = request.body;

    if (request.user.id === friendId)
      return reply.status(400).send({ message: 'A user cannot befriend itself' });
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

export async function addFriendByUsername(
  request: FastifyRequest<{ Body: FriendCreateUsername }>,
  reply: FastifyReply,
) {
  try {
    const { username } = request.body;

    if (request.user.username === username)
      return reply.status(400).send({ message: 'A user cannot befriend itself' });
    const friend = await prisma.user.findUniqueOrThrow({ where: { username: username } });
    const existingFriendship = await prisma.friendship.findUnique({
      where: {
        initiatorId_recipientId: {
          initiatorId: friend.id,
          recipientId: request.user.id,
        },
        status: FriendshipStatus.ACCEPTED,
      },
    });
    if (existingFriendship)
      return reply.status(400).send({ message: 'Friendship between users already exists.' });
    await prisma.friendship.create({
      data: {
        initiatorId: request.user.id,
        recipientId: friend.id,
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

    const friendships = await prisma.friendship.deleteMany({
      where: {
        OR: [
          {
            initiatorId: request.user.id,
            recipientId: id,
          },
          {
            initiatorId: id,
            recipientId: request.user.id,
          },
        ],
      },
    });
    if (friendships.count === 0) reply.status(404).send({ message: 'Friendship not found' });
    reply.send({ message: 'Friendship deleted' });
  } catch (error) {
    handleError(error, reply);
  }
}
