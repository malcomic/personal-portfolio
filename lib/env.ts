import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  CONTACT_FROM_EMAIL: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
  IP_HASH_SALT: z.string().min(16),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD_HASH: z.string().min(20),
  SESSION_SECRET: z.string().min(32),
});

type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

// Validated on first use rather than import, so `next build` works without runtime secrets.
export function getEnv(): Env {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid or missing environment variables (see .env.example):\n${problems}`);
  }

  cached = parsed.data;
  return cached;
}
