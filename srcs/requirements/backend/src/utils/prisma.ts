import { PrismaClient } from '@prisma/client';
import { userExtension } from './prismaExtensions';

export const prisma = new PrismaClient().$extends(userExtension);
