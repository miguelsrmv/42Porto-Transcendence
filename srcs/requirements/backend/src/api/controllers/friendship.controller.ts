import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { FriendshipStatus } from '@prisma/client';
import { FriendCreate, FriendCreateUsername, FriendUpdate } from '../../types';

export async function getUserFriends(request: FastifyRequest, reply: FastifyReply) {
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
}

export async function getUserPendingFriends(request: FastifyRequest, reply: FastifyReply) {
  const pendingFriends = await prisma.friendship.findMany({
    where: {
      recipientId: request.user.id,
      status: FriendshipStatus.PENDING,
    },
    select: { initiatorId: true },
  });
  reply.send(pendingFriends);
}

// TODO: Review friendships (sender/recipient and opposite)
export async function addFriend(
  request: FastifyRequest<{ Body: FriendCreate }>,
  reply: FastifyReply,
) {
  const { friendId } = request.body;

  if (request.user.id === friendId)
    return reply.status(400).send({ message: 'A user cannot befriend itself' });
  const friend = await prisma.user.findUniqueOrThrow({ where: { id: friendId } });
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          initiatorId: friend.id,
          recipientId: request.user.id,
        },
        {
          initiatorId: request.user.id,
          recipientId: friend.id,
        },
      ],
    },
  });
  if (existingFriendship && existingFriendship.status === FriendshipStatus.ACCEPTED)
    return reply.status(409).send({ message: 'Friendship between users already exists.' });
  if (existingFriendship && existingFriendship.status === FriendshipStatus.PENDING)
    return reply.status(409).send({ message: 'Friendship request already sent.' });
  await prisma.friendship.create({
    data: {
      initiatorId: request.user.id,
      recipientId: friendId,
    },
  });
  reply.send({ message: 'Friendship created' });
}

export async function addFriendByUsername(
  request: FastifyRequest<{ Body: FriendCreateUsername }>,
  reply: FastifyReply,
) {
  const { username } = request.body;

  if (request.user.username === username)
    return reply.status(400).send({ message: 'A user cannot befriend itself' });
  const friend = await prisma.user.findUniqueOrThrow({ where: { username: username } });
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          initiatorId: friend.id,
          recipientId: request.user.id,
        },
        {
          initiatorId: request.user.id,
          recipientId: friend.id,
        },
      ],
    },
  });
  if (existingFriendship && existingFriendship.status === FriendshipStatus.ACCEPTED)
    return reply.status(409).send({ message: 'Friendship between users already exists.' });
  if (existingFriendship && existingFriendship.status === FriendshipStatus.PENDING)
    return reply.status(409).send({ message: 'Friendship request already sent.' });
  await prisma.friendship.create({
    data: {
      initiatorId: request.user.id,
      recipientId: friend.id,
    },
  });
  reply.send({ message: 'Friendship created' });
}

// TODO: remove
export async function updateFriendshipStatus(
  request: FastifyRequest<{ Body: FriendUpdate }>,
  reply: FastifyReply,
) {
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
}

export async function acceptFriendship(
  request: FastifyRequest<{ Body: FriendCreate }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const { friendId } = request.body;
  const existingFriendship = await prisma.friendship.findFirstOrThrow({
    where: {
      initiatorId: friendId,
      recipientId: userId,
    },
  });
  if (existingFriendship.status === 'ACCEPTED')
    return reply.status(409).send({ message: 'Friendship already accepted' });

  await prisma.friendship.update({
    where: {
      initiatorId_recipientId: {
        initiatorId: friendId,
        recipientId: userId,
      },
    },
    data: {
      status: 'ACCEPTED',
    },
  });
  reply.send({ message: 'Friendship accepted' });
}

export async function deleteFriend(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
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
}
