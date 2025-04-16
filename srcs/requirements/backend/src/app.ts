import fastify from 'fastify';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import { userRoutes } from './api/routes/user.routes';
import jwtPlugin from './api/middlewares/auth';
import dotenv from 'dotenv';
import { playerRoutes } from './api/routes/player.routes';
import { friendRoutes } from './api/routes/friendship.routes';
import { matchRoutes } from './api/routes/match.routes';
import { tournamentRoutes } from './api/routes/tournament.routes';
import { WSRoutes } from './ws/websocket.routes';
import FastifyWebSocket from '@fastify/websocket';

dotenv.config();

const app = fastify({
  logger: true,
  ajv: {
    // JSON schema validation options
    customOptions: {
      removeAdditional: false, // Do not remove additional properties in JSON schema validation
    },
  },
});

app.register(FastifyWebSocket);
app.register(WSRoutes);

app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest',
} as FastifyCookieOptions);

app.register(jwtPlugin);

app.get('/', async (request, reply) => {
  reply.send({ greetings: 'Welcome to the ft_transcendence API' });
});

app.register(userRoutes, { prefix: '/users' });
app.register(playerRoutes, { prefix: '/players' });
app.register(friendRoutes, { prefix: '/friends' });
app.register(matchRoutes, { prefix: '/matches' });
app.register(tournamentRoutes, { prefix: '/tournaments' });

export default app;
