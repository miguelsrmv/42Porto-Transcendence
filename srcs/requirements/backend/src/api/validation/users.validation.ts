import { FastifyReply, FastifyRequest } from 'fastify';
import {
  hasInvalidChars,
  isPasswordValid,
  isValidEmail,
  removeEmptyStrings,
} from '../../utils/helpers';
import { prisma } from '../../utils/prisma';
import { verifyPassword } from '../../utils/hash';
import { UserCreate, UserUpdate } from '../../types';

export async function userCreateValidation(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  const { password, repeatPassword, username, email } = request.body;
  if (hasInvalidChars(username))
    return reply.code(400).send({ message: `username cannot have invalid characters` });
  if (!isValidEmail(email)) return reply.code(400).send({ message: `Invalid email format` });
  if (!isPasswordValid(password))
    return reply.code(400).send({
      message: `Password must include an uppercase letter, a lowercase letter, and a number`,
    });
  if (password !== repeatPassword) reply.code(400).send({ message: 'Passwords do not match' });
}

export async function userUpdateValidation(
  request: FastifyRequest<{ Body: UserUpdate }>,
  reply: FastifyReply,
) {
  if (!request.body.oldPassword)
    return reply.status(400).send({ message: 'Old password required' });

  request.body = removeEmptyStrings(request.body);
  const { email, username, newPassword, repeatPassword } = request.body;
  if (username && hasInvalidChars(username))
    return reply.code(400).send({ message: `username cannot have invalid characters` });
  if (email && !isValidEmail(email))
    return reply.code(400).send({ message: `Invalid email format` });
  if (newPassword && !isPasswordValid(newPassword))
    return reply.code(400).send({
      message: `Password must include an uppercase letter, a lowercase letter, and a number`,
    });

  if (
    (newPassword && repeatPassword && newPassword !== repeatPassword) ||
    (!newPassword && repeatPassword) ||
    (newPassword && !repeatPassword)
  )
    return reply.code(400).send({ message: 'Passwords do not match' });

  const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
  const isMatch = verifyPassword({
    candidatePassword: request.body.oldPassword!,
    hash: user.hashedPassword,
    salt: user.salt,
  });
  if (!isMatch) {
    return reply.status(401).send({ message: 'Invalid credentials' });
  }
}
