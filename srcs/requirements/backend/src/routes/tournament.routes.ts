import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import {
  createTournament,
  getPlayerTournaments,
  getTournamentById,
  updateTournament,
} from '../controllers/tournament.controller';
import { createTournamentSchema, updateTournamentSchema } from '../schemas/tournament.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function tournamentRoutes(fastify: FastifyInstance) {
  fastify.get('/player/:id', { schema: getByIdSchema }, getPlayerTournaments);
  fastify.get('/:id', { schema: getByIdSchema }, getTournamentById);
  fastify.post('/', { schema: createTournamentSchema }, createTournament);
  fastify.put('/:id', { schema: updateTournamentSchema }, updateTournament);
}
