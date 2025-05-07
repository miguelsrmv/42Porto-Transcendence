import { FastifyInstance } from 'fastify';
import { createFriendSchema, updateFriendSchema } from '../schemas/friendship.schema';
import {
  createFriend,
  deleteFriend,
  getUserFriends,
  updateFriend,
} from '../controllers/friendship.controller';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function friendRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getUserFriends);
  fastify.post('/', { schema: createFriendSchema }, createFriend);
  fastify.patch('/:id', { schema: updateFriendSchema }, updateFriend);
  fastify.delete('/:id', { schema: getByIdSchema }, deleteFriend);
}
