import { GameMode } from '@prisma/client';
import { gameType } from '../ws/remoteGameApp/settings';
import { UserUpdate } from '../types';
import { hashPassword } from './hash';

export function removeEmptyStrings<T extends Record<string, string>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== '')) as Partial<T>;
}

type TransformedUserUpdate = Omit<UserUpdate, 'newPassword' | 'repeatPassword'> & {
  hashedPassword?: string;
  salt?: string;
};

export function transformUserUpdate(data: UserUpdate): TransformedUserUpdate {
  const { newPassword, repeatPassword, oldPassword, ...rest } = data;
  if (newPassword) {
    const { hash, salt } = hashPassword(newPassword);
    return {
      ...rest,
      hashedPassword: hash,
      salt: salt,
    };
  }
  return {
    ...rest,
  };
}

export function gameTypeToGameMode(gameType: gameType) {
  return gameType === 'Classic Pong' ? GameMode.CLASSIC : GameMode.CRAZY;
}

export function gameTypeToEnum(gameType: gameType) {
  return gameType === 'Classic Pong' ? 0 : 1;
}
