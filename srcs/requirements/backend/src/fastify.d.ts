import "@fastify/jwt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

interface JwtUserPayload {
  email: string;
  username: string;
}

interface UserCreate {
  username: string;
  email: string;
  password: string;
}

declare module "fastify" {
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
