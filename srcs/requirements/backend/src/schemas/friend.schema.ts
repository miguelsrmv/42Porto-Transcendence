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
