import { FastifyReply, FastifyRequest } from 'fastify';
import { hasInvalidChars, isValidEmail, removeEmptyStrings } from '../../utils/helpers';
import { prisma } from '../../utils/prisma';
import { verifyPassword } from '../../utils/hash';
import { UserCreate, UserDelete, UserUpdate } from '../../types';

export async function userCreateValidation(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  for (const [key, value] of Object.entries(request.body)) {
    if (typeof value === 'string' && value.trim() === '')
      reply.code(400).send({ message: `${key} cannot be empty or whitespace` });
    else if (value.length > 320)
      reply.code(400).send({ message: `${key} cannot have over 320 characters` });
    else if (key !== 'email' && hasInvalidChars(value))
      reply.code(400).send({ message: `${key} cannot have invalid characters` });
    else if (key === 'email' && !isValidEmail(value))
      reply.code(400).send({ message: `Invalid email format` });
    return;
  }
  const { password, repeatPassword } = request.body;
  if (password !== repeatPassword) reply.code(400).send({ message: 'Passwords do not match' });
}

export async function userUpdateValidation(
  request: FastifyRequest<{ Body: UserUpdate }>,
  reply: FastifyReply,
) {
  if (!request.body.oldPassword)
    return reply.status(400).send({ message: 'Old password required' });

  const { newPassword, repeatPassword } = request.body;
  if (
    (newPassword && repeatPassword && newPassword !== repeatPassword) ||
    (!newPassword && repeatPassword) ||
    (newPassword && !repeatPassword)
  )
    return reply.code(400).send({ message: 'Passwords do not match' });

  request.body = removeEmptyStrings(request.body);
  for (const [key, value] of Object.entries(request.body)) {
    if (typeof value === 'string' && value.trim() === '')
      reply.code(400).send({ message: `${key} cannot be empty or whitespace` });
    else if (value.length > 320)
      reply.code(400).send({ message: `${key} cannot have over 320 characters` });
    else if (key !== 'email' && hasInvalidChars(value))
      reply.code(400).send({ message: `${key} cannot have invalid characters` });
    else if (key === 'email' && !isValidEmail(value))
      reply.code(400).send({ message: `Invalid email format` });
    return;
  }

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
