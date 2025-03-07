import { FastifyInstance } from "fastify";
import { getAllUsers, getUserById } from "../controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllUsers);
  fastify.get("/:id", getUserById);
}
