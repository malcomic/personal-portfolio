import { loadEnvConfig } from "@next/env";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../lib/generated/prisma/client";

loadEnvConfig(process.cwd());

export type Args = { flags: Set<string>; options: Map<string, string>; positional: string[] };

/** Parses `--flag`, `--option value` and positional arguments. */
export function parseArgs(argv = process.argv.slice(2), valueOptions: string[] = []): Args {
  const flags = new Set<string>();
  const options = new Map<string, string>();
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const [name, inline] = arg.slice(2).split("=", 2);
    if (inline !== undefined) options.set(name, inline);
    else if (valueOptions.includes(name) && argv[i + 1] !== undefined) options.set(name, argv[(i += 1)]);
    else flags.add(name);
  }
  return { flags, options, positional };
}

export function fail(message: string): never {
  console.error(`\n${message}\n`);
  process.exit(1);
}

export function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) fail("DATABASE_URL is not set. Add it to .env.local first.");
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

/** Asks the running site to refresh its static project pages. */
export async function revalidateSite(site: string) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  if (!secret || secret.length < 32) {
    console.log("REVALIDATE_SECRET is not set, so the site was not refreshed. Rebuild or save any project in the dashboard.");
    return;
  }
  try {
    const response = await fetch(new URL("/api/revalidate", site), {
      method: "POST",
      headers: { authorization: `Bearer ${secret}` },
    });
    if (response.ok) console.log(`Refreshed the public pages on ${site}.`);
    else console.log(`Revalidation on ${site} failed (${response.status}): ${await response.text()}`);
  } catch (error) {
    console.log(`Could not reach ${site} to refresh the public pages: ${(error as Error).message}`);
  }
}
