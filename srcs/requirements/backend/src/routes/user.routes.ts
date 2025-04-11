import { FastifyInstance } from 'fastify';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from '../controllers/user.controller';
import { createUserSchema, loginSchema, updateUserSchema } from '../schemas/user.schema';
import { getByIdSchema } from '../schemas/global.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllUsers);
  fastify.get('/:id', { schema: getByIdSchema }, getUserById);
  fastify.post('/', { schema: createUserSchema }, createUser);
  fastify.patch('/:id', { schema: updateUserSchema }, updateUser);
  fastify.delete('/:id', { schema: getByIdSchema }, deleteUser);
  fastify.post('/login', { schema: loginSchema }, login);
}
