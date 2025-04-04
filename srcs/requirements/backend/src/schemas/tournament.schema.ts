import { stat } from 'fs';
import { getByIdSchema } from './global.schema';

export const createTournamentSchema = {
  body: {
    type: 'object',
    required: ['maxParticipants', 'createdBy'],
    properties: {
      name: { type: 'string', minLength: 3 },
      maxParticipants: { type: 'integer' },
      createdBy: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export const updateTournamentSchema = {
  params: getByIdSchema.params,
  body: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['PENDING', 'ACTIVE', 'COMPLETED'],
      },
      currentRound: { type: 'integer' },
    },
    additionalProperties: false,
  },
};
