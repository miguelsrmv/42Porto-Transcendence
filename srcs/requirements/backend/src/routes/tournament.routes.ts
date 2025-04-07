import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import {
  createTournament,
  getAllTournaments,
  getPlayerTournaments,
  getTournamentById,
  updateTournament,
} from '../controllers/tournament.controller';
import { createTournamentSchema, updateTournamentSchema } from '../schemas/tournament.schema';
import { validateGameSettings } from '../utils/validateJson';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function tournamentRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllTournaments);
  fastify.get('/player/:id', { schema: getByIdSchema }, getPlayerTournaments);
  fastify.get('/:id', { schema: getByIdSchema }, getTournamentById);
  fastify.post(
    '/',
    { schema: createTournamentSchema, preValidation: validateGameSettings },
    createTournament,
  );
  fastify.put('/:id', { schema: updateTournamentSchema }, updateTournament);
}
