import fastify from 'fastify';
import cookie, { FastifyCookieOptions } from '@fastify/cookie';
import { userRoutes } from './routes/user.routes';
import jwtPlugin from './middlewares/auth';
import dotenv from 'dotenv';
import { playerRoutes } from './routes/player.routes';
import { friendRoutes } from './routes/friendship.routes';
import { matchRoutes } from './routes/match.routes';
import { tournamentRoutes } from './routes/tournament.routes';

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
