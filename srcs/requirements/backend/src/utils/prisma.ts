import { PrismaClient } from '@prisma/client';
import { settingsExtension, userExtension } from './prismaExtensions';

export const prisma = new PrismaClient().$extends(userExtension).$extends(settingsExtension);
