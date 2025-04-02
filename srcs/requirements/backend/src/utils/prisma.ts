import { PrismaClient } from '@prisma/client';
import { hashPassword } from './hash';

export const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ args, query }) {
        const { hash, salt } = hashPassword(args.data.hashedPassword);
        args.data.hashedPassword = hash;
        args.data.salt = salt;
        args.data.player = {
          create: {
            name: args.data.username,
            bio: `Hello, I am ${args.data.username}!`,
            avatarUrl: 'static/avatar/default/1.png',
          },
        };
        return query(args);
      },
    },
  },
});
