import { FastifyInstance } from 'fastify';
import { getProfileByIdSchema, updateProfileSchema } from '../schemas/profile.schema';
import { getAllProfiles, getProfileById, updateProfile } from '../controllers/profile.controller';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllProfiles);
  fastify.get('/:id', { schema: getProfileByIdSchema }, getProfileById);
  fastify.put('/:id', { schema: updateProfileSchema }, updateProfile);
}
