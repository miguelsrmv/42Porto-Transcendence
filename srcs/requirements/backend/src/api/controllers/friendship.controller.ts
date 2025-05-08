import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { handleError } from '../../utils/errorHandler';
import { FriendshipStatus } from '@prisma/client';

type FriendCreate = {
  userId: string;
  friendId: string;
};

export async function getUserFriends(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.user.id },
      select: { id: true },
    });
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: user.id }, { friendId: user.id }],
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
    const { userId } = request.body;
    const { friendId } = request.body;

    const friendship = await prisma.friendship.create({
      data: {
        userId: userId,
        friendId: friendId,
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
