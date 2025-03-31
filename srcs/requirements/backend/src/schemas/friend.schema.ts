import { getByIdSchema } from './global.schema';

export const createFriendSchema = {
  body: {
    type: 'object',
    required: ['profileId', 'friendId'],
    properties: {
      friendId: { type: 'string', format: 'uuid' },
      profileId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const updateFriendSchema = {
  params: getByIdSchema.params,
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'BLOCKED'] },
    },
    additionalProperties: false,
  },
};
