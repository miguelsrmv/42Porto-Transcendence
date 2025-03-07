import { FastifyInstance } from "fastify";
import { getAllUsers } from "../controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllUsers);
}
