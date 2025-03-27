import fastify from 'fastify';
import { userRoutes } from './routes/user.routes';
import jwtPlugin from './middlewares/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify({
  logger: true,
});

app.register(jwtPlugin);

app.get('/', async (request, reply) => {
  reply.send({ greetings: 'Welcome to the ft_transcendence API' });
});

app.register(userRoutes, { prefix: '/users' });

export default app;
