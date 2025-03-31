import { FastifyInstance } from 'fastify';
import { updateProfileSchema } from '../schemas/profile.schema';
import { getAllProfiles, getProfileById, updateProfile } from '../controllers/profile.controller';
import { getByIdSchema } from '../schemas/global.schema';
import { getAllFriends } from '../controllers/friendship.controller';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllProfiles);
  fastify.get('/:id/friends', { schema: getByIdSchema }, getAllFriends);
  fastify.get('/:id', { schema: getByIdSchema }, getProfileById);
  fastify.put('/:id', { schema: updateProfileSchema }, updateProfile);
}
