import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../utils/prisma';
import { verifyPassword } from '../../utils/hash';
import { handleError } from '../../utils/errorHandler';
import { finish2FAsetup, getUserClassicStats, getUserCrazyStats } from '../services/user.services';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { transformUserUpdate } from '../../utils/helpers';

export type UserCreate = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

type UserLogin = {
  email: string;
  password: string;
};

export type UserUpdate = {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  repeatPassword?: string;
};

type DefaultAvatar = {
  path: string;
};

export type VerifyToken = {
  token: string;
  password?: string;
};

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany();
    reply.send(users);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserById(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const loggedInUserId = request.user.id;

    if (loggedInUserId !== request.params.id) reply.status(401).send({ message: 'Unauthorized' });
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.params.id },
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function createUser(
  request: FastifyRequest<{ Body: UserCreate }>,
  reply: FastifyReply,
) {
  try {
    const user = await prisma.user.create({
      data: {
        username: request.body.username,
        email: request.body.email,
        hashedPassword: request.body.password,
      },
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function updateUser(
  request: FastifyRequest<{ Body: UserUpdate }>,
  reply: FastifyReply,
) {
  try {
    if (request.body.newPassword) {
      request.body = transformUserUpdate(request.body);
    }
    const user = await prisma.user.update({
      where: { id: request.user.id },
      data: request.body,
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function deleteUser(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    if (request.user.id !== request.params.id) reply.status(401).send({ message: 'Unauthorized' });
    const user = await prisma.user.delete({
      where: { id: request.params.id },
    });
    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function login(request: FastifyRequest<{ Body: UserLogin }>, reply: FastifyReply) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: request.body.email },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        salt: true,
        secret2FA: true,
      },
    });

    const isMatch = verifyPassword({
      candidatePassword: request.body.password,
      hash: user.hashedPassword,
      salt: user.salt,
    });

    if (!isMatch) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
    if (user.secret2FA) {
      const tempToken = request.server.jwt.sign(
        {
          id: user.id,
          email: user.email,
          userName: user.username,
          twoFactorPending: true,
        },
        { expiresIn: '5m' },
      );
      reply.setCookie('access_token', tempToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 5 * 60, // 5 minutes
      });

      return reply.status(206).send({ message: '2FA required' });
    }

    const token = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      userName: user.username,
    });

    reply.setCookie('access_token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 60, // Valid for 2h
    });
    reply.send({ token });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function checkLoginStatus(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.access_token;
  if (token) reply.send('User is logged in');
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token');
  reply.send({ message: 'Logout successful!' });
}

export async function getOwnUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user.id;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, username: true, email: true },
    });

    reply.send(user);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function getUserStats(
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) {
  try {
    const userMatches = await prisma.match.findMany({
      where: { OR: [{ user1Id: request.params.id }, { user2Id: request.params.id }] },
    });
    const stats = {
      classic: getUserClassicStats(userMatches, request.params.id),
      crazy: getUserCrazyStats(userMatches, request.params.id),
    };

    reply.send({ stats });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function uploadDefaultAvatar(request: FastifyRequest, reply: FastifyReply) {
  try {
    reply.send();
  } catch (error) {
    handleError(error, reply);
  }
}

export async function setup2FA(request: FastifyRequest, reply: FastifyReply) {
  try {
    // TODO: allow reset secret in case of error?
    const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
    if (user.secret2FA) throw new Error('2FA already setup for this user.');

    const secret = speakeasy.generateSecret({
      name: `ft_transcendence(${request.user.username})`,
    });
    if (!secret.otpauth_url) {
      throw new Error('No otpauth_url in secret.');
    }
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    await prisma.user.update({
      where: { id: request.user.id },
      data: { secret2FA: secret.base32 },
    });
    return qrCode; // Set img.src to this in frontend
  } catch (error) {
    handleError(error, reply);
  }
}

export async function verify2FA(
  request: FastifyRequest<{ Body: VerifyToken }>,
  reply: FastifyReply,
) {
  try {
    if (!request.cookies.access_token)
      return reply.status(400).send({ message: 'Access token not set.' });
    // if (!request.user.twoFactorPending) {
    //   return reply.status(400).send({ message: '2FA not pending' });
    // }
    const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
    if (!user.secret2FA) {
      return reply.status(401).send('2FA required but not setup.');
    }
    if (!user.enabled2FA) {
      if (!request.body.password) return reply.status(401).send('Password required.');
      const isMatch = verifyPassword({
        candidatePassword: request.body.password,
        hash: user.hashedPassword,
        salt: user.salt,
      });
      if (!isMatch) return reply.status(401).send('Password incorrect.');
    }

    const token = request.body.token;

    const verified = speakeasy.totp.verify({
      secret: user.secret2FA,
      encoding: 'base32',
      token,
    });
    if (!verified)
      reply.status(401).send('The two-factor authentication token is invalid or expired.');

    const finalToken = request.server.jwt.sign({
      id: user.id,
      email: user.email,
      userName: user.username,
    });

    reply.setCookie('access_token', finalToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 60, // Valid for 2h
    });
    if (!user.enabled2FA) {
      await prisma.user.update({ where: { id: request.user.id }, data: { enabled2FA: true } });
    }
    reply.send({ token: finalToken });
  } catch (error) {
    handleError(error, reply);
  }
}

export async function check2FAstatus(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: request.user.id } });
    reply.send(user.secret2FA != null);
  } catch (error) {
    handleError(error, reply);
  }
}

export async function disable2FA(request: FastifyRequest, reply: FastifyReply) {
  try {
    // TODO: Check if already null?
    await prisma.user.update({
      where: { id: request.user.id },
      data: { secret2FA: null, enabled2FA: false },
    });
    return reply.send('Success');
  } catch (error) {
    handleError(error, reply);
  }
}
