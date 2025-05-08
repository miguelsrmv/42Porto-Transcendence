import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TournamentCreate } from '../controllers/tournament.controller';
import { MatchCreate } from '../controllers/match.controller';

// TODO: check if necessary, change to Typebox?
export const GameSettingsSchema = z.object({
  map: z.string(),
  rounds: z.number().int().min(1),
  ballSpeed: z.number().min(0.1).max(2.0),
});

export async function validateGameSettings(
  req: FastifyRequest<{ Body: TournamentCreate | MatchCreate }>,
  reply: FastifyReply,
) {
  try {
    if (!req.body?.settings) {
      return;
    }
    const raw = req.body?.settings;
    const parsed = JSON.parse(raw);
    const result = GameSettingsSchema.safeParse(parsed);

    if (!result.success) {
      return reply.code(400).send({
        error: 'Invalid settings',
        issues: result.error.issues,
      });
    }

    req.body.settings = JSON.stringify(result.data);
  } catch (err) {
    return reply.code(400).send({
      error: 'Malformed JSON in settings',
      issues: err,
    });
  }
}
