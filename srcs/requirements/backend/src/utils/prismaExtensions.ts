import { Prisma } from '@prisma/client';
import { hashPassword } from './hash';

export const userExtension = Prisma.defineExtension({
  query: {
    user: {
      create: async ({ args, query }) => {
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
