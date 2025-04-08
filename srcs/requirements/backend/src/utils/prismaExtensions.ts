import { Prisma } from '@prisma/client';
import { hashPassword } from './hash';
import { defaultGameSettings } from './gameSettings';

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

export const settingsExtension = Prisma.defineExtension({
  query: {
    match: {
      create: async ({ args, query }) => {
        args.data.settings = JSON.stringify({
          ...defaultGameSettings,
          ...(args.data.settings ? JSON.parse(args.data.settings) : {}),
        });
        if (args.data.settings !== JSON.stringify(defaultGameSettings)) args.data.mode = 'CUSTOM';
        return query(args);
      },
    },
    tournament: {
      create: async ({ args, query }) => {
        args.data.settings = JSON.stringify({
          ...defaultGameSettings,
          ...(args.data.settings ? JSON.parse(args.data.settings) : {}),
        });
        return query(args);
      },
    },
  },
});
