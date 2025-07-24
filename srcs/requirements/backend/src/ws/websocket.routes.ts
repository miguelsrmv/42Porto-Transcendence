import { handleSocketConnection } from './handlers/remoteGameRouter';
import { FastifyInstance } from 'fastify';
import { handleSocketConnectionTournament } from './handlers/tournamentRouter';

export async function WSRoutes(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true, onRequest: [fastify.jwtAuth] }, handleSocketConnection);
  fastify.get(
    '/ws/tournament',
    { websocket: true, onRequest: [fastify.jwtAuth] },
    handleSocketConnectionTournament,
  );
}
