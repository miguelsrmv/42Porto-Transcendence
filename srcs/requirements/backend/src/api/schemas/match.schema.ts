import { getByIdSchema } from './global.schema';

export const createMatchSchema = {
  body: {
    type: 'object',
    required: ['user1Id', 'user2Id'],
    properties: {
      mode: { type: 'string', enum: ['CLASSIC', 'CRAZY'] },
      user1Id: { type: 'string', format: 'uuid' },
      user2Id: { type: 'string', format: 'uuid' },
      settings: { type: 'string' },
    },
    additionalProperties: false,
  },
};

export const updateMatchSchema = {
  params: getByIdSchema.params,
  body: {
    type: 'object',
    properties: {
      duration: { type: 'integer' },
      winnerId: { type: 'string', format: 'uuid' },
      user1Score: { type: 'integer' },
      user2Score: { type: 'integer' },
    },
    additionalProperties: false,
  },
};
