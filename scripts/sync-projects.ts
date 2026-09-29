import { projects } from "../prisma/data/projects";
import { formatSeedErrors, seedProjectRow, type SeedResult } from "../prisma/data/toRow";
import { createDb, fail, parseArgs, revalidateSite } from "./lib/cli";
import { diffRow, preview, withExistingImages, type Change } from "./lib/project-diff";

const USAGE = `Usage: npm run content:sync -- [--slug <slug>] [--apply] [--site <url>]

Compares prisma/data/projects.ts with the database and prints what would change.
  --slug   only this project
  --apply  write the changes (creates missing projects, updates changed ones)
  --site   site to refresh after applying (default http://localhost:3000)

Never deletes projects and never changes "published" or the dashboard order.`;

async function main() {
  const args = parseArgs(undefined, ["slug", "site"]);
  if (args.flags.has("help")) {
    console.log(USAGE);
    return;
  }
  const apply = args.flags.has("apply");
  const slug = args.options.get("slug");
  const site = args.options.get("site") ?? "http://localhost:3000";

  const selected = slug ? projects.filter((project) => project.slug === slug) : projects;
  if (slug && selected.length === 0) fail(`No project with slug "${slug}" in prisma/data/projects.ts.`);

  const rows = selected.map(seedProjectRow);
  const invalid = formatSeedErrors(rows);
  if (invalid) fail(`Fix these entries in prisma/data/projects.ts first (nothing was written):\n${invalid}`);

  const db = createDb();
  try {
    const existing = await db.project.findMany({ where: { slug: { in: rows.map((row) => row.slug) } } });
    const bySlug = new Map(existing.map((row) => [row.slug, row]));

    const creates: Extract<SeedResult, { ok: true }>[] = [];
    const updates: { id: string; slug: string; data: ReturnType<typeof withExistingImages>; changes: Change[] }[] = [];

    for (const row of rows) {
      if (!row.ok) continue;
      const current = bySlug.get(row.slug);
      if (!current) {
        creates.push(row);
        console.log(`\n+ ${row.slug}: new project (will be created and published)`);
        continue;
      }
      const data = withExistingImages(row.data, current);
      const changes = diffRow(current, data);
      if (changes.length === 0) {
        console.log(`\n= ${row.slug}: no changes`);
        continue;
      }
      updates.push({ id: current.id, slug: row.slug, data, changes });
      console.log(`\n~ ${row.slug}: ${changes.length} change${changes.length === 1 ? "" : "s"}`);
      for (const change of changes) {
        console.log(`    ${change.path}\n      - ${preview(change.before)}\n      + ${preview(change.after)}`);
      }
    }

    const total = creates.length + updates.length;
    if (total === 0) {
      console.log("\nThe database already matches prisma/data/projects.ts.");
      return;
    }
    if (!apply) {
      console.log(`\nDry run: ${creates.length} to create, ${updates.length} to update. Re-run with --apply to write.`);
      return;
    }

    const { _max } = await db.project.aggregate({ _max: { sortOrder: true } });
    let nextOrder = (_max.sortOrder ?? -1) + 1;
    await db.$transaction([
      ...creates.map((row) => db.project.create({ data: { ...row.data, sortOrder: nextOrder++ } })),
      ...updates.map(({ id, data }) => {
        const fields: Partial<typeof data> = { ...data };
        delete fields.published;
        delete fields.slug;
        return db.project.update({ where: { id }, data: fields });
      }),
    ]);
    console.log(`\nApplied: ${creates.length} created, ${updates.length} updated.`);
    await revalidateSite(site);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
