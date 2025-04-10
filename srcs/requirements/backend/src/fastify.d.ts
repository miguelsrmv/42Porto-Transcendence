import '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

declare global {
  type IParams = {
    id: string;
  }
}

type JwtUserPayload = {
  email: string;
  username: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    jwt: {
      sign: (payload: JwtUserPayload) => string;
      verify: (token: string) => JwtUserPayload;
    };
    jwtAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    jwtVerify: () => Promise<void>;
    user: JwtUserPayload;
  }
}
