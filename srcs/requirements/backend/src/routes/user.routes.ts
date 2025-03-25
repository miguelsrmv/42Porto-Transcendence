import { FastifyInstance } from "fastify";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
} from "../controllers/user.controller";

// NOTE: Insert '{ onRequest: [fastify.jwtAuth] }' before handler to protect route
export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", getAllUsers);
  fastify.get("/:id", getUserById);
  fastify.post("/create", createUser);
  fastify.put("/:id", updateUser);
  fastify.delete("/:id", deleteUser);
  fastify.post("/login", login);
}
