import { FastifyReply, FastifyRequest } from 'fastify';
import { UserCreate, UserUpdate } from '../controllers/user.controller';
import { removeEmptyStrings } from '../../utils/helpers';
import { prisma } from '../../utils/prisma';
import { verifyPassword } from '../../utils/hash';

export async function userCreateValidation(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  const { password, repeatPassword } = request.body;

  if (password !== repeatPassword) reply.code(400).send({ message: 'Passwords do not match' });
}

export async function userUpdateValidation(
  request: FastifyRequest<{ Body: UserUpdate }>,
  reply: FastifyReply,
) {
  if (!request.body.oldPassword)
    return reply.status(401).send({ message: 'Old password required' });

  const { newPassword, repeatPassword } = request.body;
  if (
    (newPassword && repeatPassword && newPassword !== repeatPassword) ||
    (!newPassword && repeatPassword) ||
    (newPassword && !repeatPassword)
  )
    return reply.code(400).send({ message: 'Passwords do not match' });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  const isMatch = verifyPassword({
    candidatePassword: request.body.oldPassword,
    hash: user.hashedPassword,
    salt: user.salt,
  });
  if (!isMatch) {
    return reply.status(401).send({ message: 'Invalid credentials' });
  }

  request.body = removeEmptyStrings(request.body);
}
