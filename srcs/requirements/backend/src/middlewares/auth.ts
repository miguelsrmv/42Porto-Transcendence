import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

async function jwtAuth(fastify: FastifyInstance) {
  if (!process.env.JWT_SIGN_SECRET) {
    throw new Error('JWT_SIGN_SECRET is not defined');
  }
  fastify.register(jwt, {
    secret: process.env.JWT_SIGN_SECRET as string,
  });

  fastify.decorate(
    'jwtAuth',
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        const token = request.cookies.access_token;
        if (!token) return reply.status(401).send({ message: 'Authentication required' });
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  );
}

export default fp(jwtAuth);
