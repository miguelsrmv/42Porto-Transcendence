import { FastifyInstance } from 'fastify';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from '../controllers/user.controller';
import {
  createUserSchema,
  deleteUserSchema,
  getUserByIdSchema,
  loginSchema,
  updateUserSchema,
} from '../schemas/user.schema';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllUsers);
  fastify.get('/:id', { schema: getUserByIdSchema }, getUserById);
  fastify.post('/create', { schema: createUserSchema }, createUser);
  fastify.put('/:id', { schema: updateUserSchema }, updateUser);
  fastify.delete('/:id', { schema: deleteUserSchema }, deleteUser);
  fastify.post('/login', { schema: loginSchema }, login);
}
