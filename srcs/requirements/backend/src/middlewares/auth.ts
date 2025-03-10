import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

async function jwtAuth(fastify: FastifyInstance) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SIGN_SECRET,
  });

  fastify.decorate(
    "jwtAuth",
    async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
}

export default fp(jwtAuth);
