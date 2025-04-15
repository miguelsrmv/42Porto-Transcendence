import { FastifyInstance } from 'fastify';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkLoginStatus,
} from '../controllers/user.controller';
import { createUserSchema, loginSchema, updateUserSchema } from '../schemas/user.schema';
import { getByIdSchema } from '../schemas/global.schema';
import { userCreateValidation } from '../validation/users.validation';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getAllUsers);
  fastify.get('/:id', { schema: getByIdSchema }, getUserById);
  fastify.post('/', { schema: createUserSchema, preValidation: userCreateValidation }, createUser);
  fastify.patch('/:id', { schema: updateUserSchema }, updateUser);
  fastify.delete('/:id', { schema: getByIdSchema }, deleteUser);
  fastify.post('/login', { schema: loginSchema }, login);
  fastify.get('/checkLoginStatus', { onRequest: [fastify.jwtAuth] }, checkLoginStatus);
}
