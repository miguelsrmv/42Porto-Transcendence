import fastify from 'fastify';
import { userRoutes } from './routes/user.routes';
import jwtPlugin from './middlewares/auth';
import dotenv from 'dotenv';
import { playerRoutes } from './routes/player.routes';
import { friendRoutes } from './routes/friendship.routes';

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

app.register(jwtPlugin);

app.get('/', async (request, reply) => {
  reply.send({ greetings: 'Welcome to the ft_transcendence API' });
});

app.register(userRoutes, { prefix: '/users' });
app.register(playerRoutes, { prefix: '/players' });
app.register(friendRoutes, { prefix: '/friends' });

export default app;
