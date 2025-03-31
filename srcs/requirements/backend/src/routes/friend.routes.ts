import { FastifyInstance } from 'fastify';
import { createFriendSchema } from '../schemas/friend.schema';
import { createFriend } from '../controllers/friend.controller';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function friendRoutes(fastify: FastifyInstance) {
  fastify.post('/', { schema: createFriendSchema }, createFriend);
}
