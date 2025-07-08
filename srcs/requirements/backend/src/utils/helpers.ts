import { GameMode } from '@prisma/client';
import { gameType } from '../ws/remoteGameApp/settings';
import { UserUpdate } from '../types';
import { hashPassword } from './hash';

export function removeEmptyStrings<T extends Record<string, string>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== '')) as Partial<T>;
}

export function hasInvalidChars(str: string): boolean {
  return /[ *?!\-":;,<>'#&=/@.\\]/.test(str);
}

export function isValidEmail(email: string): boolean {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;

  if (
    local.startsWith('.') ||
    local.startsWith('-') ||
    local.endsWith('.') ||
    local.endsWith('-') ||
    domain.startsWith('.') ||
    domain.startsWith('-') ||
    domain.endsWith('.') ||
    domain.endsWith('-') ||
    email.includes('..') ||
    email.includes('--')
  )
    return false;
  const forbiddenCharsRegex = /[ *?!:;/\\'"#&=]/;
  if (forbiddenCharsRegex.test(email)) return false;
  // Basic email structure: alphanumerics or dots in local, and domain-like structure after @
  const emailStructureRegex = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailStructureRegex.test(email)) return false;
  return true;
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
