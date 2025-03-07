import { FastifyInstance } from "fastify";
import { getAllUsers, getUserById, createUser } from "../controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllUsers);
  fastify.get("/:id", getUserById);
  fastify.post("/create", createUser);
}
