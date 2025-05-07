import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import {
  addPlayerToTournament,
  createTournament,
  deleteTournament,
  getAllTournaments,
  getPlayerTournaments,
  getTournamentById,
  updateTournament,
} from '../controllers/tournament.controller';
import {
  createTournamentSchema,
  tournamentParticipantSchema,
  updateTournamentSchema,
} from '../schemas/tournament.schema';
import { validateGameSettings } from '../schemas/settingsValidation';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function tournamentRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllTournaments);
  fastify.get('/user/:id', { schema: getByIdSchema }, getPlayerTournaments);
  fastify.get('/:id', { schema: getByIdSchema }, getTournamentById);
  fastify.post(
    '/',
    { schema: createTournamentSchema, preValidation: validateGameSettings },
    createTournament,
  );
  fastify.patch('/:id', { schema: updateTournamentSchema }, updateTournament);
  fastify.delete('/:id', { schema: getByIdSchema }, deleteTournament);
  fastify.post('/participant', { schema: tournamentParticipantSchema }, addPlayerToTournament);
}
