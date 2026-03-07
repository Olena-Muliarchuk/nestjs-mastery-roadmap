import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().optional().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
  BASE_URL: z.url().optional().default('http://localhost:3000'),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_EXPIRATION: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRATION: z.string().min(1),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    const tree = z.treeifyError(result.error);
    console.error(tree);
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}
