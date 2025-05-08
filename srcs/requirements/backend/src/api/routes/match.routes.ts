import { FastifyInstance } from 'fastify';
import {
  createMatch,
  getAllMatches,
  getMatchById,
  getUserMatches,
  updateMatch,
} from '../controllers/match.controller';
import { createMatchSchema, updateMatchSchema } from '../schemas/match.schema';
import { getByIdSchema } from '../schemas/global.schema';
import { validateGameSettings } from '../schemas/settingsValidation';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllMatches);
  fastify.get('/:id', { schema: getByIdSchema }, getMatchById);
  fastify.get('/user/:id', getUserMatches);
  fastify.post(
    '/',
    { schema: createMatchSchema, preValidation: validateGameSettings },
    createMatch,
  );
  fastify.patch('/:id', { schema: updateMatchSchema }, updateMatch);
}
