import { FastifyInstance } from 'fastify';
import { createFriendSchema, updateFriendSchema } from '../schemas/friendship.schema';
import {
  addFriend,
  deleteFriend,
  FriendCreate,
  FriendUpdate,
  getUserFriends,
  getUserPendingFriends,
  updateFriendshipStatus,
} from '../controllers/friendship.controller';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function friendRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getUserFriends);
  fastify.get('/pending', { onRequest: [fastify.jwtAuth] }, getUserPendingFriends);
  fastify.post<{ Body: FriendCreate }>(
    '/',
    { schema: createFriendSchema, onRequest: [fastify.jwtAuth] },
    addFriend,
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
