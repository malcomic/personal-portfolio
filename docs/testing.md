# Testing

| Command | What it runs |
| --- | --- |
| `npm test` | Vitest unit tests (`**/*.test.ts`): Zod schemas, session tokens, redirects, upload paths, sync diff |
| `npm run typecheck` | `next typegen` then `tsc --noEmit` |
| `npm run test:e2e` | Playwright tests in `e2e/` against a production build and a separate Neon test branch |
| `npm run test:all` | Unit tests, then end-to-end tests |

## End-to-end tests

The Playwright tests submit the contact form, sign in to the dashboard and change message statuses, so they need their own database. They **refuse to run** if the test database is the one in `.env.local`.

### One-time setup

1. In the Neon console, create a branch named `e2e` from `main`.
2. Create `.env.e2e.local` in the project root (it is gitignored):

   ```bash
   # Neon e2e branch: pooled and direct connection strings
   E2E_DATABASE_URL=
   E2E_DIRECT_URL=
   # Test-only admin password; the tests sign in as e2e-admin@example.test with it
   E2E_ADMIN_PASSWORD=
   # Optional: derived from E2E_ADMIN_PASSWORD when unset
   # E2E_SESSION_SECRET=
   # E2E_IP_HASH_SALT=
   ```

3. Install the browser once: `npx playwright install chromium`.

### What a run does

1. `e2e/prepare.ts` checks the database is not the real one, runs `prisma migrate deploy` and the seed on the `e2e` branch, and deletes leftover test data (messages from `@example.test` addresses and all login attempts, so rate limits never trip).
2. `next build` writes to `.next-e2e/` (your normal `.next/` is untouched), then `next start` serves it on port 3210 (`E2E_PORT` to change).
3. The server gets its own admin credentials, session secret and IP salt, contact emails are disabled (`CONTACT_EMAILS_DISABLED=true`), and the Blob token and revalidate secret are blanked.

To reuse a server you started yourself with the same variables, set `E2E_BASE_URL`; the global setup still checks and cleans the database.

## CI

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`:

- **checks:** `npm ci`, lint, typecheck, unit tests.
- **e2e:** runs after checks, one run at a time (they share the Neon branch). Skipped for pull requests from forks. On failure the Playwright report and traces are uploaded as an artifact.

Add these repository secrets (Settings, Secrets and variables, Actions):

| Secret | Value |
| --- | --- |
| `E2E_DATABASE_URL` | Neon `e2e` branch, pooled connection string |
| `E2E_DIRECT_URL` | Neon `e2e` branch, direct connection string |
| `E2E_ADMIN_PASSWORD` | Any test-only password |
| `E2E_SESSION_SECRET` | Optional, 32+ random characters |
| `E2E_IP_HASH_SALT` | Optional, 16+ random characters |
