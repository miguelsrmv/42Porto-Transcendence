import { handleSocketConnection } from './connection_router';
import { FastifyInstance } from 'fastify';

export async function WSRoutes(fastify: FastifyInstance) {
  fastify.get('/ws', { websocket: true, onRequest: [fastify.jwtAuth] }, handleSocketConnection);
}
