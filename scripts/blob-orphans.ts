import { del, list } from "@vercel/blob";
import { caseStudySchema, imageUrlsOf, screenshotSchema } from "../lib/validation/project";
import { createDb, fail, parseArgs } from "./lib/cli";
import { findOrphans, formatBytes, MIN_ORPHAN_AGE_MS, type StoredBlob } from "./lib/orphans";

const USAGE = `Usage: npm run blob:orphans -- [--apply]

Lists project images in Vercel Blob that no project uses any more
(for example uploads abandoned before the form was saved).
  --apply  delete them

Blobs uploaded in the last ${MIN_ORPHAN_AGE_MS / 3_600_000} hours are always kept.`;

const PREFIX = "projects/";
const DELETE_BATCH = 100;

async function listProjectBlobs(token: string) {
  const blobs: StoredBlob[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000, token });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function referencedUrls() {
  const db = createDb();
  try {
    const rows = await db.project.findMany({ select: { images: true, listScreenshot: true, caseStudy: true } });
    const urls = new Set<string>();
    for (const row of rows) {
      row.images.forEach((url) => urls.add(url));
      const listScreenshot = screenshotSchema.safeParse(row.listScreenshot);
      const caseStudy = caseStudySchema.safeParse(row.caseStudy);
      if (listScreenshot.success && caseStudy.success) {
        imageUrlsOf({ listScreenshot: listScreenshot.data, caseStudy: caseStudy.data }).forEach((url) => urls.add(url));
      }
    }
    return { urls, projectCount: rows.length };
  } finally {
    await db.$disconnect();
  }
}

async function main() {
  const args = parseArgs();
  if (args.flags.has("help")) {
    console.log(USAGE);
    return;
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) fail("BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local first.");

  const [blobs, { urls, projectCount }] = await Promise.all([listProjectBlobs(token), referencedUrls()]);
  const { orphans, tooRecent } = findOrphans(blobs, urls);

  console.log(`${blobs.length} blobs under ${PREFIX}, ${urls.size} image URLs used by ${projectCount} projects.`);
  if (tooRecent > 0) console.log(`Keeping ${tooRecent} unused blob(s) uploaded in the last 24 hours.`);
  if (orphans.length === 0) {
    console.log("No orphaned blobs.");
    return;
  }

  const total = orphans.reduce((sum, blob) => sum + blob.size, 0);
  console.log(`\n${orphans.length} orphaned blob(s), ${formatBytes(total)}:`);
  for (const blob of orphans) {
    console.log(`  ${blob.pathname}  ${formatBytes(blob.size)}  uploaded ${blob.uploadedAt.toISOString().slice(0, 10)}`);
  }

  if (!args.flags.has("apply")) {
    console.log("\nDry run: nothing deleted. Run with --apply to delete them.");
    return;
  }
  for (let i = 0; i < orphans.length; i += DELETE_BATCH) {
    await del(
      orphans.slice(i, i + DELETE_BATCH).map((blob) => blob.url),
      { token },
    );
  }
  console.log(`\nDeleted ${orphans.length} blob(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
