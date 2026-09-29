import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createInterface } from "node:readline/promises";
import { del, put } from "@vercel/blob";
import { chromium } from "playwright";
import sharp from "sharp";
import {
  screenshotConfigSchema,
  shotNames,
  slotFor,
  slotSizes,
  type ScreenshotProject,
  type ShotName,
} from "../content/screenshots.config";
import { MAX_IMAGE_BYTES } from "../lib/uploads";
import { caseStudySchema, imageUrlsOf, screenshotSchema } from "../lib/validation/project";
import { createDb, fail, parseArgs, revalidateSite } from "./lib/cli";

const ROOT = path.join(process.cwd(), ".screenshots");
const OUT_DIR = path.join(ROOT, "out");
const AUTH_DIR = path.join(ROOT, "auth");
const MAX_WIDTH = 2400;

const USAGE = `Usage:
  npm run screenshots:login   -- --slug <slug>
  npm run screenshots:capture -- [--slug <slug>] [--shot card|hero|gallery1|gallery2]
  npm run screenshots:upload  -- [--slug <slug>] [--site <url>]

Options:
  --config <file>  screenshot config module (default content/screenshots.config.ts)

Captures land in .screenshots/out/<slug>/<shot>.webp with a contact sheet at
.screenshots/out/contact-sheet.html. Review them before uploading.`;

const args = parseArgs(process.argv.slice(3), ["slug", "shot", "site", "config"]);
const command = process.argv[2];

async function loadConfig(): Promise<ScreenshotProject[]> {
  const configPath = args.options.get("config");
  const source = configPath
    ? ((await import(pathToFileURL(path.resolve(configPath)).href)) as { screenshotConfig: unknown }).screenshotConfig
    : (await import("../content/screenshots.config")).screenshotConfig;
  const parsed = screenshotConfigSchema.safeParse(source);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  ${issue.path.join(".")}: ${issue.message}`).join("\n");
    fail(`The screenshot config is invalid:\n${problems}`);
  }
  if (parsed.data.length === 0) fail("The screenshot config is empty. Fill in content/screenshots.config.ts first.");
  return parsed.data;
}

function selectProjects(config: ScreenshotProject[]) {
  const slug = args.options.get("slug");
  if (!slug) return config;
  const match = config.filter((project) => project.slug === slug);
  if (match.length === 0) fail(`No project with slug "${slug}" in the screenshot config.`);
  return match;
}

const authFile = (slug: string) => path.join(AUTH_DIR, `${slug}.json`);

async function login() {
  const slug = args.options.get("slug") ?? fail("Pass --slug <slug>.");
  const [project] = selectProjects(await loadConfig());
  const url = project.loginUrl ?? Object.values(project.shots).find(Boolean)?.url;
  if (!url) fail(`"${slug}" has no loginUrl or shots to open.`);

  await mkdir(AUTH_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: false });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(url);
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    await prompt.question("\nSign in in the browser window (use a demo account if you can), then press Enter here... ");
    prompt.close();
    await context.storageState({ path: authFile(slug) });
    console.log(`Saved the session to ${path.relative(process.cwd(), authFile(slug))} (gitignored).`);
  } finally {
    await browser.close();
  }
}

type Capture = { slug: string; shot: ShotName; file: string; bytes: number; width: number; height: number };

async function capture() {
  const projects = selectProjects(await loadConfig());
  const onlyShot = args.options.get("shot") as ShotName | undefined;
  if (onlyShot && !shotNames.includes(onlyShot)) fail(`--shot must be one of ${shotNames.join(", ")}.`);

  const browser = await chromium.launch();
  const captures: Capture[] = [];
  const failures: string[] = [];
  try {
    for (const project of projects) {
      if (project.auth && !existsSync(authFile(project.slug))) {
        failures.push(`${project.slug}: needs a login first (npm run screenshots:login -- --slug ${project.slug})`);
        continue;
      }
      const dir = path.join(OUT_DIR, project.slug);
      await mkdir(dir, { recursive: true });

      for (const shot of shotNames) {
        const spec = project.shots[shot];
        if (!spec || (onlyShot && onlyShot !== shot)) continue;
        const size = slotSizes[slotFor(shot)];
        const context = await browser.newContext({
          viewport: size,
          deviceScaleFactor: 2,
          colorScheme: project.colorScheme,
          reducedMotion: "reduce",
          storageState: project.auth ? authFile(project.slug) : undefined,
        });
        try {
          const page = await context.newPage();
          await page.goto(spec.url, { waitUntil: "networkidle", timeout: 45_000 });
          if (spec.waitFor) await page.locator(spec.waitFor).first().waitFor({ state: "visible", timeout: 20_000 });
          if (spec.hide.length > 0) {
            await page.addStyleTag({ content: `${spec.hide.join(", ")} { visibility: hidden !important; }` });
          }
          if (spec.scrollTo) await page.locator(spec.scrollTo).first().scrollIntoViewIfNeeded();
          await page.waitForTimeout(spec.delayMs);

          const png = await page.screenshot({
            type: "png",
            animations: "disabled",
            mask: spec.mask.map((sel) => page.locator(sel)),
            maskColor: "#262626",
          });
          const file = path.join(dir, `${shot}.webp`);
          const info = await sharp(png)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(file);
          captures.push({ slug: project.slug, shot, file, bytes: info.size, width: info.width, height: info.height });
          console.log(`  ${project.slug}/${shot}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
        } catch (error) {
          failures.push(`${project.slug}/${shot}: ${(error as Error).message.split("\n")[0]}`);
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  const sheet = await writeContactSheet();
  if (captures.length > 0) console.log(`\nReview them in ${path.relative(process.cwd(), sheet)} before uploading.`);
  const tooLarge = captures.filter((c) => c.bytes > MAX_IMAGE_BYTES);
  for (const c of tooLarge) failures.push(`${c.slug}/${c.shot}: ${(c.bytes / 1024 / 1024).toFixed(1)}MB is over the 4MB limit`);
  if (failures.length > 0) fail(`Some captures need attention:\n  ${failures.join("\n  ")}`);
}

async function writeContactSheet() {
  await mkdir(OUT_DIR, { recursive: true });
  const slugs = (await readdir(OUT_DIR, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  const sections: string[] = [];
  for (const slug of slugs.sort()) {
    const cards: string[] = [];
    for (const shot of shotNames) {
      const file = path.join(OUT_DIR, slug, `${shot}.webp`);
      if (!existsSync(file)) continue;
      const { size, mtime } = await stat(file);
      const warn = size > MAX_IMAGE_BYTES ? ' class="warn"' : "";
      cards.push(
        `<figure><img src="${slug}/${shot}.webp?${mtime.getTime()}" alt="${slug} ${shot}"><figcaption${warn}>${shot} · ${(size / 1024).toFixed(0)} KB</figcaption></figure>`,
      );
    }
    if (cards.length > 0) sections.push(`<section><h2>${slug}</h2><div class="grid">${cards.join("")}</div></section>`);
  }
  const html = `<!doctype html><meta charset="utf-8"><title>Screenshot contact sheet</title>
<style>body{font:14px system-ui;background:#0a0a0a;color:#fafafa;margin:32px}h2{font-size:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px}
figure{margin:0}img{width:100%;border:1px solid #333;border-radius:4px}figcaption{color:#a3a3a3;margin-top:6px}.warn{color:#ef4444}</style>
<h1>Screenshot contact sheet</h1>${sections.join("") || "<p>No captures yet.</p>"}`;
  const sheet = path.join(OUT_DIR, "contact-sheet.html");
  await writeFile(sheet, html);
  return sheet;
}

async function upload() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() || fail("BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local first.");
  const onlySlug = args.options.get("slug");
  const site = args.options.get("site") ?? "http://localhost:3000";
  if (!existsSync(OUT_DIR)) fail("Nothing to upload. Run screenshots:capture first.");

  const slugs = (await readdir(OUT_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && (!onlySlug || d.name === onlySlug))
    .map((d) => d.name);
  if (slugs.length === 0) fail(onlySlug ? `No captures for "${onlySlug}".` : "Nothing to upload.");

  const db = createDb();
  let updated = 0;
  try {
    for (const slug of slugs) {
      const row = await db.project.findUnique({ where: { slug } });
      if (!row) {
        console.log(`- ${slug}: no project with this slug in the database, skipped.`);
        continue;
      }
      const list = screenshotSchema.safeParse(row.listScreenshot);
      const caseStudy = caseStudySchema.safeParse(row.caseStudy);
      if (!list.success || !caseStudy.success) {
        console.log(`- ${slug}: stored project data is invalid; fix it in the dashboard first, skipped.`);
        continue;
      }

      const files = shotNames.filter((shot) => existsSync(path.join(OUT_DIR, slug, `${shot}.webp`)));
      const urls: Partial<Record<ShotName, string>> = {};
      for (const shot of files) {
        const body = await readFile(path.join(OUT_DIR, slug, `${shot}.webp`));
        if (body.byteLength > MAX_IMAGE_BYTES) {
          console.log(`- ${slug}/${shot}: over the 4MB limit, skipped.`);
          continue;
        }
        const blob = await put(`projects/${slug}/${shot}.webp`, body, {
          access: "public",
          token,
          addRandomSuffix: true,
          contentType: "image/webp",
        });
        urls[shot] = blob.url;
        console.log(`  ${slug}/${shot} -> ${blob.url}`);
      }
      if (Object.keys(urls).length === 0) continue;

      const listScreenshot = { ...list.data, image: urls.card ?? list.data.image };
      const nextCaseStudy = {
        ...caseStudy.data,
        hero: { ...caseStudy.data.hero, image: urls.hero ?? caseStudy.data.hero.image },
        gallery: [
          { ...caseStudy.data.gallery[0], image: urls.gallery1 ?? caseStudy.data.gallery[0].image },
          { ...caseStudy.data.gallery[1], image: urls.gallery2 ?? caseStudy.data.gallery[1].image },
        ] as [typeof caseStudy.data.gallery[0], typeof caseStudy.data.gallery[1]],
      };
      const images = imageUrlsOf({ listScreenshot, caseStudy: nextCaseStudy });
      await db.project.update({
        where: { id: row.id },
        data: { listScreenshot, caseStudy: nextCaseStudy, images },
      });
      updated += 1;

      const replaced = row.images.filter((url) => !images.includes(url));
      if (replaced.length > 0) {
        try {
          await del(replaced, { token });
          console.log(`  removed ${replaced.length} replaced image${replaced.length === 1 ? "" : "s"} from Blob`);
        } catch (error) {
          console.log(`  could not remove replaced images: ${(error as Error).message}`);
        }
      }
    }
  } finally {
    await db.$disconnect();
  }

  console.log(`\nAttached screenshots to ${updated} project${updated === 1 ? "" : "s"}.`);
  if (updated > 0) await revalidateSite(site);
}

const commands: Record<string, () => Promise<void>> = { login, capture, upload };

(commands[command] ?? (async () => console.log(USAGE)))().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
