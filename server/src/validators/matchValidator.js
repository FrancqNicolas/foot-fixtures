import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';

const teamSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().nullable().optional(),
  score: z.number().nullable().optional()
});

export const matchSchema = z.object({
  matchId: z.number().optional(),
  title: z.string().optional(),
  team1: teamSchema,
  team2: teamSchema,
  date: z.string().or(z.date()),
  status: z.enum(['scheduled', 'live', 'finished']).default('scheduled'),
  minute: z.number().nullable().optional(),
  competition: z.string().optional(),
  stage: z.string().optional()
});

export const syncMatchesSchema = z.object({
  season: z.number().nullable().optional()
});

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation error: ${errors}`, 400);
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation error: ${errors}`, 400);
  }
  req.query = result.data;
  next();
};
