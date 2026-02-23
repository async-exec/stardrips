import 'dotenv';
import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;
