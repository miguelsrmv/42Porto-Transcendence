import { FastifyInstance } from 'fastify';
import { getLeaderboard } from '../controllers/leaderboard.controller';

export async function leaderboardRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getLeaderboard);
}
