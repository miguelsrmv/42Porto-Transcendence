import { Match } from '@prisma/client';
import { getUserRank, getUserScore } from './leaderboard.services';
import { prisma } from '../../utils/prisma';
import app from '../../app';
import { getWonTournaments } from './tournament.services';
import { randomUUID } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserSessionData } from '../../types';

const COOKIE_MAX_AGE = 2 * 60 * 60; // Valid for 2h

export async function getUserGlobalStats(matches: Match[], userId: string) {
  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.winnerId === userId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: await getUserScore(userId),
    rank: await getUserRank(userId),
    tournaments: await getWonTournaments(userId),
  };
}

export async function getAvatarFromPlayer(playerID: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: playerID } });
  if (!user) app.log.error('User not found in getAvatarFromPlayer');
  return user.avatarUrl;
}

export async function updateSession(id: string) {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * COOKIE_MAX_AGE);
  await prisma.user.update({
    where: { id: id },
    data: { sessionToken: sessionId, sessionExpiresAt: expiresAt },
  });
  return sessionId;
}

export function setJWTCookie(
  request: FastifyRequest,
  reply: FastifyReply,
  userData: UserSessionData,
) {
  const token = request.server.jwt.sign({
    id: userData.id,
    email: userData.email,
    userName: userData.username,
    sessionId: userData.sessionId,
  });
  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    maxAge: COOKIE_MAX_AGE,
  });
  return token;
}
