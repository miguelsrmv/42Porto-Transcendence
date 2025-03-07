import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

async function jwtAuth(fastify: FastifyInstance) {
  fastify.register(require("@fastify/jwt"), {
    secret: "kj-d4hsa5bf2uy3qe3w9537g37e3r8fd5vb",
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
