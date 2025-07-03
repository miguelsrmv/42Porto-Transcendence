import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { prisma } from '../../utils/prisma';

async function jwtAuth(fastify: FastifyInstance) {
  if (!process.env.JWT_SIGN_SECRET) {
    throw new Error('JWT_SIGN_SECRET is not defined');
  }
  fastify.register(jwt, {
    secret: process.env.JWT_SIGN_SECRET as string,
    cookie: {
      cookieName: 'access_token',
      // NOTE: signing would prevent cookie tampering, but JWT is already protected
      signed: false,
    },
  });

  fastify.decorate(
    'jwtAuth',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const token = request.cookies.access_token;
        if (!token) return reply.status(401).send({ message: 'Authentication required' });
        await request.jwtVerify();
        const { id, sessionId } = request.user;
        const user = await prisma.user.findUnique({
          where: { id: id },
        });
        if (
          !user ||
          user.sessionToken !== sessionId ||
          !user.sessionExpiresAt ||
          user.sessionExpiresAt < new Date()
        ) {
          reply.clearCookie('access_token');
          return reply.status(401).send({ message: 'Session invalid or expired' });
        }
      } catch (err) {
        reply.send(err);
      }
    },
  );
}

export default fp(jwtAuth);
