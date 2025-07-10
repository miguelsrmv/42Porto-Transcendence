import { FastifyInstance } from 'fastify';
import { createFriendByUsernameSchema, createFriendSchema } from '../schemas/friendship.schema';
import {
  acceptFriendship,
  addFriend,
  addFriendByUsername,
  deleteFriend,
  getUserFriends,
  getUserPendingFriends,
} from '../controllers/friendship.controller';
import { getByIdSchema } from '../schemas/global.schema';
import { FriendCreate, FriendCreateUsername } from '../../types';

export async function friendRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getUserFriends);
  fastify.get('/pending', { onRequest: [fastify.jwtAuth] }, getUserPendingFriends);
  fastify.post<{ Body: FriendCreate }>(
    '/',
    { schema: createFriendSchema, onRequest: [fastify.jwtAuth] },
    addFriend,
  );
  fastify.post<{ Body: FriendCreateUsername }>(
    '/username',
    { schema: createFriendByUsernameSchema, onRequest: [fastify.jwtAuth] },
    addFriendByUsername,
  );
  fastify.patch<{ Body: FriendCreate }>(
    '/accept',
    { schema: createFriendSchema, onRequest: [fastify.jwtAuth] },
    acceptFriendship,
  );
  fastify.delete<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    deleteFriend,
  );
}
