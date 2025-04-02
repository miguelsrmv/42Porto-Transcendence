import { FastifyInstance } from 'fastify';
import { createMatch, getMatchById, getPlayerMatches } from '../controllers/match.controller';
import { createMatchSchema } from '../schemas/match.schema';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function playerRoutes(fastify: FastifyInstance) {
  fastify.get('/', getPlayerMatches);
  fastify.post('/', { schema: createMatchSchema }, createMatch);
  fastify.get('/:id', { schema: getByIdSchema }, getMatchById);
  //   fastify.put('/:id', { schema: updateMatchSchema }, updateMatch);
}
