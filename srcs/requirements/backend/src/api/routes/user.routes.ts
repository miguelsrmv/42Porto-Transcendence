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
  getUserStats,
  uploadDefaultAvatar,
} from '../controllers/user.controller';
import { createUserSchema, loginSchema, updateUserSchema } from '../schemas/user.schema';
import { getByIdSchema } from '../schemas/global.schema';
import { userCreateValidation, userUpdateValidation } from '../validation/users.validation';

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', { onRequest: [fastify.jwtAuth] }, getAllUsers);
  fastify.post('/', { schema: createUserSchema, preValidation: userCreateValidation }, createUser);
  fastify.delete('/logout', { onRequest: [fastify.jwtAuth] }, logout);
  fastify.post('/login', { schema: loginSchema }, login);
  fastify.get('/me', { onRequest: [fastify.jwtAuth] }, getOwnUser);
  fastify.get('/checkLoginStatus', { onRequest: [fastify.jwtAuth] }, checkLoginStatus);
  fastify.put('/users/defaultAvatar', uploadDefaultAvatar);
  fastify.get<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getUserById,
  );
  // TODO: Add preValidation for UserCreate
  fastify.patch<{ Body: UserUpdate }>(
    '/',
    { schema: updateUserSchema, onRequest: [fastify.jwtAuth], preValidation: userUpdateValidation },
    updateUser,
  );
  fastify.delete<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    deleteUser,
  );
  fastify.get('/:id/stats', { schema: getByIdSchema }, getUserStats);
}
