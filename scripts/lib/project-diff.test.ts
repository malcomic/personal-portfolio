import { describe, expect, it } from "vitest";
import { projects } from "../../prisma/data/projects";
import { seedProjectRow } from "../../prisma/data/toRow";
import type { ProjectRowData } from "../../lib/project-row";
import { diffRow, preview, withExistingImages, type CurrentRow } from "./project-diff";

const BLOB = (name: string) => `https://abc.public.blob.vercel-storage.com/projects/zizi/${name}.webp`;

function seedRow(): ProjectRowData {
  const result = seedProjectRow(projects[0]);
  if (!result.ok) throw new Error("seed project should be valid");
  return result.data;
}

function asStored(row: ProjectRowData): CurrentRow {
  return JSON.parse(JSON.stringify(row));
}

describe("diffRow", () => {
  it("finds no changes for an identical row", () => {
    const row = seedRow();
    expect(diffRow(asStored(row), row)).toEqual([]);
  });

  it("reports only the edited paths", () => {
    const row = seedRow();
    const edited = { ...row, title: "New title", caseStudy: { ...row.caseStudy, tagline: "New tagline" } };
    expect(diffRow(asStored(row), edited).map((change) => change.path)).toEqual(["title", "caseStudy.tagline"]);
  });

  it("reports removed list items", () => {
    const row = seedRow();
    const stored = asStored({ ...row, tags: [...row.tags, "Extra"] });
    const changes = diffRow(stored, row);
    expect(changes).toEqual([{ path: `tags.${row.tags.length}`, before: "Extra", after: undefined }]);
  });
});

describe("withExistingImages", () => {
  it("returns the seed row unchanged for a new project", () => {
    const row = seedRow();
    expect(withExistingImages(row, null)).toBe(row);
  });

  it("keeps stored screenshots the seed file doesn't set", () => {
    const row = seedRow();
    const stored = asStored(row);
    (stored.listScreenshot as { image?: string }).image = BLOB("card");
    (stored.caseStudy as ProjectRowData["caseStudy"]).gallery[1].image = BLOB("gallery2");

    const merged = withExistingImages(row, stored);
    expect(merged.listScreenshot.image).toBe(BLOB("card"));
    expect(merged.caseStudy.gallery[1].image).toBe(BLOB("gallery2"));
    expect(merged.images).toEqual([BLOB("card"), BLOB("gallery2")]);
    expect(diffRow({ ...stored, images: merged.images }, merged)).toEqual([]);
  });

  it("prefers an image set in the seed file", () => {
    const row = seedRow();
    const withSeedImage = { ...row, listScreenshot: { ...row.listScreenshot, image: BLOB("new") } };
    const stored = asStored(row);
    (stored.listScreenshot as { image?: string }).image = BLOB("old");
    expect(withExistingImages(withSeedImage, stored).listScreenshot.image).toBe(BLOB("new"));
  });
});

describe("preview", () => {
  it("truncates long values and marks missing ones", () => {
    expect(preview(undefined)).toBe("(none)");
    expect(preview("x".repeat(100), 10)).toHaveLength(10);
    expect(preview(true)).toBe("true");
  });
});
