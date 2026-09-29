// Runs before `next build` in the Playwright web server command: the build reads projects from the database.
import { execSync } from "node:child_process";
import { assertTestDatabase, cleanTestData } from "./db";
import { e2e } from "./env";

async function main() {
  if (process.env.DATABASE_URL !== e2e.databaseUrl || process.env.DIRECT_URL !== e2e.directUrl) {
    throw new Error("e2e/prepare.ts must run with DATABASE_URL and DIRECT_URL set to the E2E database.");
  }
  assertTestDatabase();
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  execSync("npx prisma db seed", { stdio: "inherit" });
  await cleanTestData();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
