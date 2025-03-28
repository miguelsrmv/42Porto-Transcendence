// TODO: Create global schema for id search
export const getProfileByIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
};

export const updateProfileSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          bio: { type: 'string', maxLength: 300 },
        },
        additionalProperties: false,
      },
    },
  },
};
