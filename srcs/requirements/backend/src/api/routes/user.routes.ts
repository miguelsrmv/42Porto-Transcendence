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
  setup2FA,
  verify2FA,
  check2FAstatus,
  disable2FA,
  VerifyToken,
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
  fastify.put('/defaultAvatar', uploadDefaultAvatar);
  fastify.get('/2FA/setup', { onRequest: [fastify.jwtAuth] }, setup2FA);
  fastify.post<{ Body: VerifyToken }>('/2FA/verify', { onRequest: [fastify.jwtAuth] }, verify2FA);
  fastify.get('/2FA/check', { onRequest: [fastify.jwtAuth] }, check2FAstatus);
  fastify.get('/2FA/disable', { onRequest: [fastify.jwtAuth] }, disable2FA);
  fastify.get<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getUserById,
  );
  // TODO: Add preValidation for UserUpdate
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
