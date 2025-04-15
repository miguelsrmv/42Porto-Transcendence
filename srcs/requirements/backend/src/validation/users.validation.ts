import { FastifyReply, FastifyRequest } from 'fastify';
import { UserCreate } from '../controllers/user.controller';

export async function userCreateValidation(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  const { password, repeatPassword } = request.body;

  if (password !== repeatPassword) reply.code(400).send({ message: 'Passwords do not match' });
}
