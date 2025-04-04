import { FastifyInstance } from 'fastify';
import {
  createMatch,
  getAllMatches,
  getMatchById,
  getPlayerMatches,
  updateMatch,
} from '../controllers/match.controller';
import { createMatchSchema, updateMatchSchema } from '../schemas/match.schema';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllMatches);
  fastify.get('/:id', { schema: getByIdSchema }, getMatchById);
  fastify.get('/player/:id', getPlayerMatches);
  fastify.post('/', { schema: createMatchSchema }, createMatch);
  fastify.put('/:id', { schema: updateMatchSchema }, updateMatch);
}
