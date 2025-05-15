import { getByIdSchema } from './global.schema';

export const createFriendSchema = {
  body: {
    type: 'object',
    required: ['initiatorId', 'recipientId'],
    properties: {
      initiatorId: { type: 'string', format: 'uuid' },
      recipientId: { type: 'string', format: 'uuid' },
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
      status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED'] },
    },
    additionalProperties: false,
  },
};
