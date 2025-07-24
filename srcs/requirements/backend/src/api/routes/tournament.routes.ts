import { FastifyInstance } from 'fastify';
import { getByIdSchema } from '../schemas/global.schema';
import { getTournamentStatus, getUserLastTournaments } from '../controllers/tournament.controller';

export async function tournamentRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: IParams }>(
    '/user/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getUserLastTournaments,
  );
  fastify.get<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getTournamentStatus,
  );
}
