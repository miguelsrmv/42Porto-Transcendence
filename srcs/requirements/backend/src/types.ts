import { FriendshipStatus } from '@prisma/client';

export type UserCreate = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type UserUpdate = {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  repeatPassword?: string;
};

export type UserSessionData = {
  id: string;
  username: string;
  email: string;
  sessionId: string;
};

export type AvatarData = {
  data: string;
};

export type DefaultAvatar = {
  path: string;
};

export type VerifyToken = {
  code: string;
  password?: string;
};

export type Login2FAData = {
  code: string;
  email: string;
  password: string;
};

export type OnlineState = 'online' | 'offline' | 'inGame';

export type FriendCreate = {
  friendId: string;
};

export type FriendCreateUsername = {
  username: string;
};

export type FriendUpdate = {
  friendId: string;
  status: FriendshipStatus;
};
