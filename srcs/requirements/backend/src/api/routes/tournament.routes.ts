import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import {
  // addPlayerToTournament,
  // createTournament,
  // deleteTournament,
  // getAllTournaments,
  getUserTournaments,
  // updateTournament,
  // tournamentBlockchain,
} from '../controllers/tournament.controller';
import {
  createTournamentSchema,
  tournamentParticipantSchema,
  updateTournamentSchema,
} from '../schemas/tournament.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function tournamentRoutes(fastify: FastifyInstance) {
  // fastify.get('/', getAllTournaments);
  fastify.get('/user/:id', { schema: getByIdSchema }, getUserTournaments);
  // fastify.post('/', { schema: createTournamentSchema }, createTournament);
  // fastify.post('/newTournament', tournamentBlockchain);
  // fastify.patch('/:id', { schema: updateTournamentSchema }, updateTournament);
  // fastify.delete('/:id', { schema: getByIdSchema }, deleteTournament);
  // fastify.post('/participant', { schema: tournamentParticipantSchema }, addPlayerToTournament);
}
