import fastify from "fastify";
import { userRoutes } from "./routes/user.routes";

const server = fastify({
  logger: true,
});

server.get("/", async (request, reply) => {
  reply.send({ hello: "world" });
});

server.register(userRoutes, { prefix: "/users" });

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
