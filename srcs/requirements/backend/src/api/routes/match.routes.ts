import { FastifyInstance } from 'fastify';
import { getMatchById, getUserMatches } from '../controllers/match.controller';
import { getByIdSchema } from '../schemas/global.schema';

export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getMatchById,
  );
  fastify.get<{ Params: IParams }>('/user/:id', { onRequest: [fastify.jwtAuth] }, getUserMatches);
}
