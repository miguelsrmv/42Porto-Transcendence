import { getByIdSchema } from "./global.schema";

export const createMatchSchema = {
  body: {
    type: 'object',
    required: ['mode', 'player1Id', 'player2Id', 'settings'],
    properties: {
      mode: { type: 'string', enum: ['CLASSIC', 'CUSTOM'] },
      player1Id: { type: 'string', format: 'uuid' },
      player2Id: { type: 'string', format: 'uuid' },
      settings: {
        type: 'object',
        properties: {
          matchId: { type: 'string', format: 'uuid' },
          allowPowerUps: { type: 'boolean' },
          map: { type: 'string' },
          rounds: { type: 'integer' },
          ballSpeed: { type: 'float', minimum: 0.1, maximum: 2.0 },
        },
        additionalProperties: false,
      },
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
