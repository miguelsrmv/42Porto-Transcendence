import { FastifyInstance } from 'fastify';
import { updatePlayerSchema } from '../schemas/player.schema';
import {
  getAllPlayers,
  getOwnPlayer,
  getPlayerById,
  getPlayerStats,
  updatePlayer,
} from '../controllers/player.controller';
import { getByIdSchema } from '../schemas/global.schema';
// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function playerRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllPlayers);
  fastify.get('/me', { onRequest: [fastify.jwtAuth] }, getOwnPlayer);
  fastify.get('/:id', { schema: getByIdSchema }, getPlayerById);
  fastify.patch('/:id', { schema: updatePlayerSchema }, updatePlayer);
  fastify.get('/:id/stats', { schema: getByIdSchema }, getPlayerStats);
}
