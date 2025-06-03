import { FastifyInstance } from 'fastify';
import {
  createMatch,
  getMatchById,
  getOwnUserMatches,
  getUserMatches,
  updateMatch,
} from '../controllers/match.controller';
import { createMatchSchema, updateMatchSchema } from '../schemas/match.schema';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get('/:id', { schema: getByIdSchema }, getMatchById);
  fastify.get('/me', { onRequest: [fastify.jwtAuth] }, getOwnUserMatches);
  fastify.get('/user/:id', getUserMatches);
  fastify.post('/', { schema: createMatchSchema }, createMatch);
  fastify.patch('/:id', { schema: updateMatchSchema }, updateMatch);
}
