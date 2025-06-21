import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { verifyPassword } from '../../utils/hash';
import { getUserGlobalStats, setJWTCookie, updateSession } from '../services/user.services';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { transformUserUpdate } from '../../utils/helpers';
import fs from 'fs';
import util from 'util';
import { pipeline } from 'stream';
import path from 'path';
import { getUserRank } from '../services/leaderboard.services';
import {
  AvatarData,
  DefaultAvatar,
  Login2FAData,
  UserCreate,
  UserLogin,
  UserSessionData,
  UserUpdate,
  VerifyToken,
} from '../../types';

export async function getUserById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: request.params.id },
    select: { username: true, lastActiveAt: true, avatarUrl: true, sessionExpiresAt: true },
  });
  const friendScore = await prisma.leaderboard.findUnique({
    where: { userId: request.params.id },
  });
  const currentTime = Date.now() / 1000;
  const inactiveTime = currentTime - user.lastActiveAt.getTime() / 1000;
  let onlineState = 'offline';
  // TODO: Review online state
  if (user.sessionExpiresAt && user.sessionExpiresAt > new Date() && inactiveTime < 10 * 60)
    onlineState = 'online';
  // TODO: Add inGame logic
  reply.send({
    ...user,
    rank: await getUserRank(request.params.id),
    points: friendScore?.score,
    onlineState: onlineState,
  });
}

export async function createUser(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  const user = await prisma.user.create({
    data: {
      username: request.body.username,
      email: request.body.email,
      hashedPassword: request.body.password,
    },
    select: { username: true, email: true },
  });
  reply.send(user);
}

export async function updateUser(
  request: FastifyRequest<{ Body: UserUpdate }>,
  reply: FastifyReply,
) {
  request.body = transformUserUpdate(request.body);
  const user = await prisma.user.update({
    where: { id: request.user.id },
    data: request.body,
    select: { username: true, email: true },
  });
  reply.send(user);
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  await prisma.user.delete({
    where: { id: request.user.id },
    select: { username: true, email: true },
  });
  reply.send({ message: 'User deleted successfully' });
}

export async function preLogin(request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: request.body.email },
    select: {
      hashedPassword: true,
      salt: true,
      enabled2FA: true,
      sessionToken: true,
      sessionExpiresAt: true,
    },
  });

  const isMatch = verifyPassword({
    candidatePassword: request.body.password,
    hash: user.hashedPassword,
    salt: user.salt,
  });

  if (!isMatch) {
    return reply.status(401).send({ message: 'Invalid credentials' });
  }

  if (user.sessionToken && user.sessionExpiresAt && user.sessionExpiresAt > new Date()) {
    return reply.status(403).send({
      message: 'User is already logged in on another device or tab.',
    });
  }

  if (user.enabled2FA) return reply.status(206).send({ enabled2FA: true });
  reply.send({ enabled2FA: false });
}

// TODO: review HTTP codes
export async function login2FA(
  request: FastifyRequest<{ Body: Login2FAData }>,
  reply: FastifyReply,
) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: request.body.email },
    select: {
      id: true,
      username: true,
      email: true,
      hashedPassword: true,
      salt: true,
      enabled2FA: true,
      secret2FA: true,
      avatarUrl: true,
      sessionToken: true,
      sessionExpiresAt: true,
    },
  });

  const isMatch = verifyPassword({
    candidatePassword: request.body.password,
    hash: user.hashedPassword,
    salt: user.salt,
  });

  if (!isMatch) {
    return reply.status(401).send({ message: 'Invalid credentials' });
  }

  if (user.sessionToken && user.sessionExpiresAt && user.sessionExpiresAt > new Date()) {
    return reply.status(403).send({
      message: 'User is already logged in on another device or tab.',
    });
  }
  if (!user.enabled2FA) return reply.status(401).send({ message: '2FA not setup' });
  if (!user.secret2FA) return reply.status(401).send('2FA required but not setup.');

  const token = request.body.code;

  const verified = speakeasy.totp.verify({
    secret: user.secret2FA,
    encoding: 'base32',
    token,
  });
  if (!verified)
    return reply.status(401).send('The two-factor authentication token is invalid or expired.');

  const sessionId = await updateSession(user.id);
  const userData: UserSessionData = {
    id: user.id,
    username: user.username,
    email: user.email,
    sessionId: sessionId,
  };
  setJWTCookie(request, reply, userData);
  reply.send({ avatar: user.avatarUrl });
}

export async function login(request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: request.body.email },
    select: {
      id: true,
      username: true,
      email: true,
      hashedPassword: true,
      salt: true,
      enabled2FA: true,
      avatarUrl: true,
      sessionToken: true,
      sessionExpiresAt: true,
    },
  });

  const isMatch = verifyPassword({
    candidatePassword: request.body.password,
    hash: user.hashedPassword,
    salt: user.salt,
  });

  if (!isMatch) {
    return reply.status(401).send({ message: 'Invalid credentials' });
  }

  if (user.sessionToken && user.sessionExpiresAt && user.sessionExpiresAt > new Date()) {
    return reply.status(403).send({
      message: 'User is already logged in on another device or tab.',
    });
  }

  if (user.enabled2FA) return reply.status(401).send({ message: '2FA required' });

  const sessionId = await updateSession(user.id);
  const userData: UserSessionData = {
    id: user.id,
    username: user.username,
    email: user.email,
    sessionId: sessionId,
  };
  setJWTCookie(request, reply, userData);
  reply.send({ avatar: user.avatarUrl });
}

export async function checkLoginStatus(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.access_token;
  if (token) reply.send('User is logged in');
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token');
  await prisma.user.update({
    where: { id: request.user.id },
    data: { sessionToken: null, sessionExpiresAt: null },
  });
  reply.send({ message: 'Logout successful!' });
}

export async function getOwnUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, username: true, email: true, avatarUrl: true },
  });

  reply.send(user);
}

export async function getUserStats(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  const userMatches = await prisma.match.findMany({
    where: { OR: [{ user1Id: request.params.id }, { user2Id: request.params.id }] },
  });

  reply.send({ stats: await getUserGlobalStats(userMatches, request.params.id) });
}

export async function setDefaultAvatar(
  request: FastifyRequest<{ Body: DefaultAvatar }>,
  reply: FastifyReply,
) {
  if (!request.body.path) return reply.status(400).send({ message: 'Path to avatar required.' });
  await prisma.user.update({
    where: { id: request.user.id },
    data: { avatarUrl: request.body.path },
  });
  reply.send({ message: 'Path to avatar updated successfully.' });
}

export async function uploadCustomAvatar(
  request: FastifyRequest<{ Body: AvatarData }>,
  reply: FastifyReply,
) {
  const pump = util.promisify(pipeline);
  const parts = request.files();
  const userId = request.user.id;
  const avatarDir = path.resolve(__dirname, '../../../../avatar');
  const filePath = path.join(avatarDir, `${userId}.png`);
  for await (const part of parts) {
    await pump(part.file, fs.createWriteStream(filePath));
  }
  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: `../../../../static/avatar/custom/${userId}.png` },
  });
  reply.send({ message: 'Avatar uploaded.' });
}

export async function getAvatarPath(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  reply.send({ path: user.avatarUrl });
}

export async function setup2FA(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  if (user.enabled2FA)
    return reply.status(400).send({ message: '2FA already setup for this user.' });

  const secret = speakeasy.generateSecret({
    name: `ft_transcendence(${user.username})`,
  });
  if (!secret.otpauth_url) {
    return reply.status(500).send({ message: 'No otpauth_url in secret.' });
  }
  const qrCode = await qrcode.toDataURL(secret.otpauth_url);
  await prisma.user.update({
    where: { id: request.user.id },
    data: { secret2FA: secret.base32 },
  });
  return qrCode; // Set img.src to this in frontend
}

export async function verify2FA(
  request: FastifyRequest<{ Body: VerifyToken }>,
  reply: FastifyReply,
) {
  if (!request.cookies.access_token)
    return reply.status(400).send({ message: 'Access token not set.' });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  if (!user.secret2FA) {
    return reply.status(401).send('2FA required but not setup.');
  }
  if (!user.enabled2FA) {
    if (!request.body.password) return reply.status(401).send('Password required.');
    const isMatch = verifyPassword({
      candidatePassword: request.body.password,
      hash: user.hashedPassword,
      salt: user.salt,
    });
    if (!isMatch) return reply.status(401).send('Password incorrect.');
  }

  const token = request.body.code;

  const verified = speakeasy.totp.verify({
    secret: user.secret2FA,
    encoding: 'base32',
    token,
  });
  if (!verified)
    return reply.status(401).send('The two-factor authentication token is invalid or expired.');

  const sessionId = await updateSession(user.id);
  const userData: UserSessionData = {
    id: user.id,
    username: user.username,
    email: user.email,
    sessionId: sessionId,
  };
  const finalToken = setJWTCookie(request, reply, userData);
  if (!user.enabled2FA) {
    await prisma.user.update({ where: { id: request.user.id }, data: { enabled2FA: true } });
  }
  reply.send({ token: finalToken });
}

export async function check2FAstatus(request: FastifyRequest, reply: FastifyReply) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  reply.send(user.enabled2FA);
}

export async function disable2FA(
  request: FastifyRequest<{ Body: VerifyToken }>,
  reply: FastifyReply,
) {
  if (!request.cookies.access_token)
    return reply.status(400).send({ message: 'Access token not set.' });
  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  if (!user.enabled2FA) return reply.status(401).send('2FA not setup.');
  if (!user.secret2FA) return reply.status(401).send('2FA required but not setup.');

  if (!request.body.password) return reply.status(401).send('Password required.');
  const isMatch = verifyPassword({
    candidatePassword: request.body.password,
    hash: user.hashedPassword,
    salt: user.salt,
  });
  if (!isMatch) return reply.status(401).send('Password incorrect.');

  const token = request.body.code;

  const verified = speakeasy.totp.verify({
    secret: user.secret2FA,
    encoding: 'base32',
    token,
  });
  if (!verified)
    return reply.status(401).send('The two-factor authentication token is invalid or expired.');
  await prisma.user.update({
    where: { id: request.user.id },
    data: { secret2FA: null, enabled2FA: false },
  });
  return reply.send('Success');
}

// TODO: Remove, unused
export async function isUserOnline(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: request.params.id },
    select: { sessionExpiresAt: true, lastActiveAt: true },
  });
  const currentTime = Date.now() / 1000;
  const inactiveTime = currentTime - user.lastActiveAt.getTime() / 1000;
  let isOnline = false;
  // TODO: Review online state
  if (user.sessionExpiresAt && user.sessionExpiresAt > new Date() && inactiveTime < 10 * 60)
    isOnline = true;
  reply.send(isOnline);
}
