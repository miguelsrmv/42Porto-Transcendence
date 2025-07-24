import { LEN_USERNAME } from './user.schema';

export const createFriendSchema = {
  body: {
    type: 'object',
    required: ['friendId'],
    properties: {
      friendId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const createFriendByUsernameSchema = {
  body: {
    type: 'object',
    required: ['username'],
    properties: {
      username: { type: 'string', minLength: 3, maxLength: LEN_USERNAME },
    },
    additionalProperties: false,
  },
};
