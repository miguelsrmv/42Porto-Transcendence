export const gameSettingsSchema = {
  type: 'object',
  properties: {
    matchId: { type: 'string', format: 'uuid' },
    tournamentId: { type: 'string', format: 'uuid' },
    allowPowerUps: { type: 'boolean' },
    map: { type: 'string' },
    rounds: { type: 'integer' },
    ballSpeed: { type: 'number', minimum: 0.1, maximum: 2.0 },
  },
  additionalProperties: false,
};
