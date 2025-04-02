import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../utils/prisma';
import { handleError } from '../utils/errorHandler';
import { FriendshipStatus } from '@prisma/client';

interface FriendCreate {
  playerId: string;
  friendId: string;
}

export async function getAllFriends(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ playerId: request.params.id }, { friendId: request.params.id }],
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
    const { playerId } = request.body;
    const { friendId } = request.body;

    const friendship = await prisma.friendship.create({
      data: {
        playerId: playerId,
        friendId,
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
