import { JWT } from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

declare global {
  type IParams = {
    id: string;
  }
}

type JwtUserPayload = {
  id: string;
  email: string;
  username: string;
  twoFactorPending?: boolean;
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
    jwt: JWT;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtUserPayload
  }
}
