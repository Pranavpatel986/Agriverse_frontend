import { z } from "zod";

/**
 * Single source of truth for environment configuration.
 *
 * The API base URL is NEVER hardcoded anywhere else in the app — every
 * consumer (Axios client, server components, middleware) imports `env`
 * from here. Locally it falls back to the documented dev backend
 * (http://localhost:8081/api/v1 — confirmed against the generated
 * OpenAPI doc's `servers[0].url`, which corrected an earlier assumption
 * of 8080) in staging/production it MUST come from
 * NEXT_PUBLIC_API_BASE_URL, injected at build/deploy time.
 *
 * NEXT_PUBLIC_-prefixed vars are inlined at build time by Next.js and are
 * readable in the browser — fine for a base URL, never for secrets.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:8081/api/v1"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

function loadEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    // Fail loudly at build/boot time rather than surfacing a confusing
    // runtime fetch error later.
    console.error(
      "❌ Invalid environment configuration:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment configuration — see log above.");
  }

  return parsed.data;
}

export const env = loadEnv();
