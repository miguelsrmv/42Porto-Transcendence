import { Character } from '@prisma/client';
import { getByIdSchema } from './global.schema';

export const createTournamentSchema = {
  body: {
    type: 'object',
    required: ['maxParticipants', 'createdBy'],
    properties: {
      name: { type: 'string', minLength: 3 },
      maxParticipants: { type: 'integer' },
      createdBy: { type: 'string', format: 'uuid' },
      settings: { type: 'string' },
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

export const tournamentParticipantSchema = {
  body: {
    type: 'object',
    required: ['playerId'],
    properties: {
      tournamentId: { type: 'string', format: 'uuid' },
      playerId: { type: 'string', format: 'uuid' },
      alias: { type: 'string' },
      character: { type: 'string', enum: Object.values(Character) },
    },
    additionalProperties: false,
  },
};
