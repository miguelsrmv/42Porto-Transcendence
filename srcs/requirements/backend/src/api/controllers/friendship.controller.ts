import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { FriendshipStatus } from '@prisma/client';

type FriendCreate = {
  userId: string;
  recipientId: string;
};

export async function getUserFriends(request: FastifyRequest, reply: FastifyReply) {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ initiatorId: request.user.id }, { recipientId: request.user.id }],
      },
    });
    reply.send(friends);
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

export async function createFriend(
  request: FastifyRequest<{ Body: FriendCreate }>,
  reply: FastifyReply,
) {
  try {
    const { userId } = request.body;
    const { recipientId } = request.body;

    const friendship = await prisma.friendship.create({
      data: {
        initiatorId: userId,
        recipientId: recipientId,
      },
    });
    reply.send(friendship);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateFriend(
  request: FastifyRequest<{ Params: IParams; Body: { status: FriendshipStatus } }>,
  reply: FastifyReply,
) {
  try {
    // Friendship id
    const { id } = request.params;
    const { status } = request.body;

    const friendship = await prisma.friendship.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    reply.send(friendship);
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

    const friendship = await prisma.friendship.delete({
      where: {
        id: id,
      },
    });
    reply.send(friendship);
  } catch (error) {
    handleError(error, reply);
  }
}
