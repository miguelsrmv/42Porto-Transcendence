import { FastifyInstance } from 'fastify';
import { createFriendSchema, updateFriendSchema } from '../schemas/friend.schema';
import { createFriend, deleteFriend, updateFriend } from '../controllers/friend.controller';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/', { schema: createFriendSchema }, createFriend);
  fastify.put('/:id', { schema: updateFriendSchema }, updateFriend);
  fastify.delete('/:id', { schema: getByIdSchema }, deleteFriend);
}
