import fastify from "fastify";
import { userRoutes } from "./routes/user.routes";
import jwtPlugin from "./middlewares/auth";

const server = fastify({
  logger: true,
});

server.register(jwtPlugin);

server.get("/", async (request, reply) => {
  reply.send({ greetings: "Welcome to the ft_transcendence API" });
});

server.register(userRoutes, { prefix: "/users" });

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
