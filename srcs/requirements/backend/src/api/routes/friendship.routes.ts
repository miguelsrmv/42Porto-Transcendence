import { FastifyInstance } from 'fastify';
import {
  createFriendByUsernameSchema,
  createFriendSchema,
  updateFriendSchema,
} from '../schemas/friendship.schema';
import {
  addFriend,
  addFriendByUsername,
  deleteFriend,
  getUserFriends,
  getUserPendingFriends,
  updateFriendshipStatus,
} from '../controllers/friendship.controller';
import { getByIdSchema } from '../schemas/global.schema';
import { FriendCreate, FriendCreateUsername, FriendUpdate } from '../../types';

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
  fastify.patch<{ Body: FriendUpdate }>(
    '/',
    { schema: updateFriendSchema, onRequest: [fastify.jwtAuth] },
    updateFriendshipStatus,
  );
  fastify.delete<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    deleteFriend,
  );
}
