import { defineConfig, devices } from "@playwright/test";
import bcrypt from "bcryptjs";
import { e2e } from "./e2e/env";

const CI = Boolean(process.env.CI);
const useExistingServer = Boolean(process.env.E2E_BASE_URL);

function serverEnv(): Record<string, string> {
  const hash = bcrypt.hashSync(e2e.adminPassword, 10);
  return {
    NEXT_DIST_DIR: ".next-e2e",
    NEXT_TELEMETRY_DISABLED: "1",
    DATABASE_URL: e2e.databaseUrl,
    DIRECT_URL: e2e.directUrl,
    ADMIN_EMAIL: e2e.adminEmail,
    ADMIN_PASSWORD_HASH: Buffer.from(hash).toString("base64"),
    SESSION_SECRET: e2e.sessionSecret,
    IP_HASH_SALT: e2e.ipHashSalt,
    CONTACT_EMAILS_DISABLED: "true",
    RESEND_API_KEY: "re_e2e_disabled",
    CONTACT_FROM_EMAIL: "E2E <e2e@example.test>",
    CONTACT_TO_EMAIL: "e2e-inbox@example.test",
    // Empty values stop .env.local from supplying the real ones.
    BLOB_READ_WRITE_TOKEN: "",
    REVALIDATE_SECRET: "",
  };
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: e2e.baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: useExistingServer
    ? undefined
    : {
        command: `npx tsx e2e/prepare.ts && npm run build && npm run start -- -p ${e2e.port}`,
        url: e2e.baseURL,
        env: serverEnv(),
        timeout: 600_000,
        reuseExistingServer: false,
        stdout: "pipe",
        stderr: "pipe",
      },
});
