import { readFileSync, existsSync } from "node:fs";
import { parseEnv } from "node:util";
import { neon } from "@neondatabase/serverless";
import { e2e, TEST_EMAIL_DOMAIN } from "./env";

function host(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname.replace("-pooler", "")}${pathname}`;
  } catch {
    return url;
  }
}

/** Refuses to touch a database that .env.local (the real site) also points at. */
export function assertTestDatabase() {
  const testHosts = new Set([host(e2e.databaseUrl), host(e2e.directUrl)]);
  if (!existsSync(".env.local")) return;
  const local = parseEnv(readFileSync(".env.local", "utf8"));
  for (const key of ["DATABASE_URL", "DIRECT_URL"] as const) {
    const value = local[key]?.trim();
    if (value && testHosts.has(host(value))) {
      throw new Error(
        `E2E_DATABASE_URL/E2E_DIRECT_URL point at the same database as ${key} in .env.local. ` +
          "Use a separate Neon branch for tests.",
      );
    }
  }
}

export async function cleanTestData() {
  const sql = neon(e2e.databaseUrl);
  const messages = await sql`DELETE FROM "Message" WHERE email LIKE ${`%@${TEST_EMAIL_DOMAIN}`} RETURNING id`;
  const attempts = await sql`DELETE FROM "LoginAttempt" RETURNING id`;
  console.log(`E2E cleanup: removed ${messages.length} test messages and ${attempts.length} login attempts.`);
}
