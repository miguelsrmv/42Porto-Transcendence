import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import { getTournamentStatus, getUserLastTournaments } from '../controllers/tournament.controller';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function tournamentRoutes(fastify: FastifyInstance) {
  fastify.get('/user/:id', { schema: getByIdSchema }, getUserLastTournaments);
  fastify.get('/:id', { schema: getByIdSchema }, getTournamentStatus);
}
