import { GameMode } from '@prisma/client';
import { UserUpdate } from '../api/controllers/user.controller';
import { gameType } from '../ws/remoteGameApp/settings';

export function removeEmptyStrings<T extends Record<string, string>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== '')) as Partial<T>;
}

type TransformedUserUpdate = Omit<UserUpdate, 'newPassword' | 'repeatPassword'> & {
  hashedPassword?: string;
};

export function transformUserUpdate(data: UserUpdate): TransformedUserUpdate {
  const { newPassword, repeatPassword, oldPassword, ...rest } = data;

  return {
    ...rest,
    ...(newPassword !== undefined ? { hashedPassword: newPassword } : {}),
  };
}

export function gameTypeToGameMode(gameType: gameType) {
  return gameType === 'Classic Pong' ? GameMode.CLASSIC : GameMode.CRAZY;
}

export function gameTypeToEnum(gameType: gameType) {
  return gameType === 'Classic Pong' ? 0 : 1;
}