import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./hash";

export const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ model, operation, args, query }) {
        const { hash, salt } = hashPassword(args.data.hashedPassword);
        args.data.hashedPassword = hash;
        args.data.salt = salt;

        return query(args);
      },
    },
  },
});
