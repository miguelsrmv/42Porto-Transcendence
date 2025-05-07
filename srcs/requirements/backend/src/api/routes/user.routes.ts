import { FastifyInstance } from 'fastify';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkLoginStatus,
  logout,
  getOwnUser,
  UserUpdate,
  getPlayerStats,
} from '../controllers/user.controller';
import { createUserSchema, loginSchema, updateUserSchema } from '../schemas/user.schema';
import { getByIdSchema } from '../schemas/global.schema';
import { userCreateValidation } from '../validation/users.validation';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getAllUsers);
  fastify.post('/', { schema: createUserSchema, preValidation: userCreateValidation }, createUser);
  fastify.delete('/logout', { onRequest: [fastify.jwtAuth] }, logout);
  fastify.post('/login', { schema: loginSchema }, login);
  fastify.get('/me', { onRequest: [fastify.jwtAuth] }, getOwnUser);
  fastify.get('/checkLoginStatus', { onRequest: [fastify.jwtAuth] }, checkLoginStatus);
  fastify.get<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getUserById,
  );
  fastify.patch<{ Params: IParams; Body: UserUpdate }>(
    '/:id',
    { schema: updateUserSchema, onRequest: [fastify.jwtAuth] },
    updateUser,
  );
  fastify.delete<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    deleteUser,
  );
  fastify.get('/:id/stats', { schema: getByIdSchema }, getPlayerStats);
}
