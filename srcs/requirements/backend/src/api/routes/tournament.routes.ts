import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import {
  getTournamentById,
  getUserLastThreeTournaments,
} from '../controllers/tournament.controller';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function tournamentRoutes(fastify: FastifyInstance) {
  // fastify.get('/', getAllTournaments);
  fastify.get('/user/:id', { schema: getByIdSchema }, getUserLastThreeTournaments);
  fastify.get('/:id', { schema: getByIdSchema }, getTournamentById);
  // fastify.post('/', { schema: createTournamentSchema }, createTournament);
  // fastify.post('/newTournament', tournamentBlockchain);
  // fastify.patch('/:id', { schema: updateTournamentSchema }, updateTournament);
  // fastify.delete('/:id', { schema: getByIdSchema }, deleteTournament);
  // fastify.post('/participant', { schema: tournamentParticipantSchema }, addPlayerToTournament);
}
