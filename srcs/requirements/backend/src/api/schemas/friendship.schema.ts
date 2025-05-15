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

export const updateFriendSchema = {
  body: {
    type: 'object',
    required: ['friendId', 'status'],
    properties: {
      friendId: { type: 'string', format: 'uuid' },
      status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED'] },
    },
    additionalProperties: false,
  },
};
