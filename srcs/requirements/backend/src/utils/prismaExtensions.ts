import { Prisma } from '@prisma/client';
import { hashPassword } from './hash';

export const userExtension = Prisma.defineExtension({
  query: {
    user: {
      create: async ({ args, query }) => {
        const { hash, salt } = hashPassword(args.data.hashedPassword);
        args.data.hashedPassword = hash;
        args.data.salt = salt;
        args.data.leaderboard = { create: {} };
        return query(args);
      },
    },
  },
});
