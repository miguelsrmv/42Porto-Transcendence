import { FastifyInstance } from "fastify";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllUsers);
  fastify.get("/:id", getUserById);
  fastify.post("/create", createUser);
  fastify.put("/:id", updateUser);
  fastify.delete("/:id", deleteUser);
}
