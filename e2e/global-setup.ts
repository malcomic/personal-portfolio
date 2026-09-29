import { assertTestDatabase, cleanTestData } from "./db";

/** Also runs when E2E_BASE_URL points at a server Playwright didn't start (and so didn't prepare). */
export default async function globalSetup() {
  assertTestDatabase();
  await cleanTestData();
}
