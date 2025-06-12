import { FastifyInstance } from 'fastify';
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkLoginStatus,
  logout,
  getOwnUser,
  getUserStats,
  setup2FA,
  verify2FA,
  check2FAstatus,
  disable2FA,
  getAvatarPath,
  setDefaultAvatar,
  uploadCustomAvatar,
  preLogin,
  login2FA,
  isUserOnline,
} from '../controllers/user.controller';
import {
  createUserSchema,
  login2FASchema,
  loginSchema,
  updateUserSchema,
} from '../schemas/user.schema';
import { getByIdSchema } from '../schemas/global.schema';
import { userCreateValidation, userUpdateValidation } from '../validation/users.validation';
import { AvatarData, DefaultAvatar, UserUpdate, VerifyToken } from '../../types';

// TODO: review request methods
// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/', { schema: createUserSchema, preValidation: userCreateValidation }, createUser);
  fastify.delete('/logout', { onRequest: [fastify.jwtAuth] }, logout);
  fastify.post('/preLogin', { schema: loginSchema }, preLogin);
  fastify.post('/login2FA', { schema: login2FASchema }, login2FA);
  fastify.post('/login', { schema: loginSchema }, login);
  fastify.get('/me', { onRequest: [fastify.jwtAuth] }, getOwnUser);
  fastify.get('/checkLoginStatus', { onRequest: [fastify.jwtAuth] }, checkLoginStatus);
  fastify.put<{ Body: DefaultAvatar }>(
    '/defaultAvatar',
    { onRequest: [fastify.jwtAuth] },
    setDefaultAvatar,
  );
  fastify.put<{ Body: AvatarData }>(
    '/customAvatar',
    { onRequest: [fastify.jwtAuth] },
    uploadCustomAvatar,
  );
  fastify.get('/getAvatarPath', { onRequest: [fastify.jwtAuth] }, getAvatarPath);
  fastify.get('/2FA/setup', { onRequest: [fastify.jwtAuth] }, setup2FA);
  fastify.post<{ Body: VerifyToken }>('/2FA/verify', { onRequest: [fastify.jwtAuth] }, verify2FA);
  fastify.get('/2FA/check', { onRequest: [fastify.jwtAuth] }, check2FAstatus);
  fastify.post<{ Body: VerifyToken }>('/2FA/disable', { onRequest: [fastify.jwtAuth] }, disable2FA);
  fastify.get<{ Params: IParams }>(
    '/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getUserById,
  );
  fastify.get<{ Params: IParams }>(
    '/isOnline/:id',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    isUserOnline,
  );
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
  fastify.get<{ Params: IParams }>(
    '/:id/stats',
    { schema: getByIdSchema, onRequest: [fastify.jwtAuth] },
    getUserStats,
  );
}
