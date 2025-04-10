import { getByIdSchema } from './global.schema';

export const updatePlayerSchema = {
  params: getByIdSchema.params,
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      bio: { type: 'string', maxLength: 300 },
    },
    additionalProperties: false,
  },
};
