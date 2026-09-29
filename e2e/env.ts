import { createHash } from "node:crypto";
import { existsSync } from "node:fs";

const ENV_FILE = ".env.e2e.local";

if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set. Add it to ${ENV_FILE} (see docs/testing.md) or the CI secrets.`);
  }
  return value;
}

/** Stable per password, so every Playwright process derives the same value. */
function derived(label: string, password: string) {
  return createHash("sha256").update(`${label}:${password}`).digest("base64");
}

export const e2e = {
  port: Number(process.env.E2E_PORT ?? 3210),
  get baseURL() {
    return process.env.E2E_BASE_URL ?? `http://localhost:${this.port}`;
  },
  adminEmail: "e2e-admin@example.test",
  get adminPassword() {
    return required("E2E_ADMIN_PASSWORD");
  },
  get databaseUrl() {
    return required("E2E_DATABASE_URL");
  },
  get directUrl() {
    return required("E2E_DIRECT_URL");
  },
  get sessionSecret() {
    return process.env.E2E_SESSION_SECRET?.trim() || derived("session", this.adminPassword);
  },
  get ipHashSalt() {
    return process.env.E2E_IP_HASH_SALT?.trim() || derived("ip", this.adminPassword);
  },
};

/** Messages from this domain are deleted before each run. */
export const TEST_EMAIL_DOMAIN = "example.test";
