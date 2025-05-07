import { getByIdSchema } from './global.schema';

export const createMatchSchema = {
  body: {
    type: 'object',
    required: ['player1Id', 'player2Id'],
    properties: {
      mode: { type: 'string', enum: ['CLASSIC', 'CRAZY'] },
      player1Id: { type: 'string', format: 'uuid' },
      player2Id: { type: 'string', format: 'uuid' },
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
      player1Score: { type: 'integer' },
      player2Score: { type: 'integer' },
    },
    additionalProperties: false,
  },
};
