import type { ProjectRowData } from "../../lib/project-row";
import { caseStudySchema, imageUrlsOf, screenshotSchema } from "../../lib/validation/project";

/** The row fields the sync script owns. `published` and `sortOrder` stay dashboard decisions. */
export const SYNCED_FIELDS = [
  "title",
  "subtitle",
  "status",
  "description",
  "listDescription",
  "listScreenshot",
  "features",
  "tags",
  "liveUrl",
  "repoUrl",
  "featured",
  "caseStudy",
  "images",
] as const;

type SyncedField = (typeof SYNCED_FIELDS)[number];
export type CurrentRow = { [K in SyncedField]: unknown };
export type Change = { path: string; before: unknown; after: unknown };

/** Keeps image URLs already stored in the database when the seed entry has none for that slot. */
export function withExistingImages(desired: ProjectRowData, current: CurrentRow | null): ProjectRowData {
  if (!current) return desired;
  const list = screenshotSchema.safeParse(current.listScreenshot);
  const caseStudy = caseStudySchema.safeParse(current.caseStudy);
  const pick = (seed: string | undefined, stored: string | undefined) => seed ?? stored;

  const merged: ProjectRowData = {
    ...desired,
    listScreenshot: {
      ...desired.listScreenshot,
      image: pick(desired.listScreenshot.image, list.data?.image),
    },
    caseStudy: {
      ...desired.caseStudy,
      hero: { ...desired.caseStudy.hero, image: pick(desired.caseStudy.hero.image, caseStudy.data?.hero.image) },
      gallery: [
        { ...desired.caseStudy.gallery[0], image: pick(desired.caseStudy.gallery[0].image, caseStudy.data?.gallery[0].image) },
        { ...desired.caseStudy.gallery[1], image: pick(desired.caseStudy.gallery[1].image, caseStudy.data?.gallery[1].image) },
      ],
    },
  };
  return { ...merged, images: imageUrlsOf(merged) };
}

function flatten(value: unknown, prefix: string, out: Map<string, unknown>) {
  if (Array.isArray(value)) {
    if (value.length === 0) out.set(prefix, "[]");
    value.forEach((item, index) => flatten(item, `${prefix}.${index}`, out));
  } else if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (item !== undefined) flatten(item, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.set(prefix, value);
  }
  return out;
}

export function diffRow(current: CurrentRow, desired: ProjectRowData): Change[] {
  const changes: Change[] = [];
  for (const field of SYNCED_FIELDS) {
    const before = flatten(current[field], field, new Map());
    const after = flatten(desired[field], field, new Map());
    for (const path of new Set([...before.keys(), ...after.keys()])) {
      const a = before.get(path);
      const b = after.get(path);
      if (JSON.stringify(a) !== JSON.stringify(b)) changes.push({ path, before: a, after: b });
    }
  }
  return changes;
}

export function preview(value: unknown, max = 70) {
  if (value === undefined) return "(none)";
  const text = typeof value === "string" ? JSON.stringify(value) : String(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
