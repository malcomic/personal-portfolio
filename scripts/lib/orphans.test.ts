import { describe, expect, it } from "vitest";
import { findOrphans, formatBytes, MIN_ORPHAN_AGE_MS, type StoredBlob } from "./orphans";

const NOW = Date.parse("2026-09-29T12:00:00Z");
const blob = (name: string, ageMs: number): StoredBlob => ({
  url: `https://abc.public.blob.vercel-storage.com/projects/zizi/${name}.webp`,
  pathname: `projects/zizi/${name}.webp`,
  size: 1000,
  uploadedAt: new Date(NOW - ageMs),
});

describe("findOrphans", () => {
  const used = blob("used", MIN_ORPHAN_AGE_MS * 3);
  const old = blob("old", MIN_ORPHAN_AGE_MS + 1);
  const fresh = blob("fresh", 60_000);

  it("returns old unreferenced blobs and counts recent ones separately", () => {
    const { orphans, tooRecent } = findOrphans([used, old, fresh], new Set([used.url]), NOW);
    expect(orphans).toEqual([old]);
    expect(tooRecent).toBe(1);
  });

  it("never returns referenced blobs, however old", () => {
    expect(findOrphans([used], new Set([used.url]), NOW).orphans).toEqual([]);
  });
});

describe("formatBytes", () => {
  it.each([
    [512, "512 B"],
    [2048, "2 KB"],
    [5 * 1024 * 1024, "5.0 MB"],
  ])("%d bytes is %s", (bytes, expected) => expect(formatBytes(bytes)).toBe(expected));
});
