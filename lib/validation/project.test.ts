import { describe, expect, it } from "vitest";
import { projects } from "@/prisma/data/projects";
import { seedProjectRow } from "@/prisma/data/toRow";
import {
  emptyProjectValues,
  imageUrlSchema,
  imageUrlsOf,
  isBlobUrl,
  projectErrors,
  projectInputSchema,
  SLUG_PATTERN,
  type ProjectFormValues,
} from "./project";

const BLOB = "https://abc123.public.blob.vercel-storage.com/projects/zizi/card-x1y2.webp";

function validInput(): ProjectFormValues {
  const values = emptyProjectValues();
  const block = { title: "Offline sync", body: "Queues writes locally and replays them." };
  return {
    ...values,
    title: "Zizi",
    slug: "zizi",
    subtitle: "Dairy farm SaaS",
    status: "LIVE",
    description: "Farm records for low-network areas.",
    listDescription: "Farm records for low-network areas.",
    features: ["Milk yield tracking"],
    tags: ["Next.js"],
    listScreenshot: { caption: "Dashboard" },
    caseStudy: {
      ...values.caseStudy,
      headline: "Zizi",
      tagline: "Farm records",
      facts: { client: "Self", role: "Solo", technologies: "Next.js", delivery: "2025" },
      hero: { caption: "Hero" },
      problem: "Paper records.",
      built: "A PWA.",
      gallery: [{ caption: "One" }, { caption: "Two" }],
      architecture: [block],
      challenges: [block],
    },
  };
}

describe("SLUG_PATTERN", () => {
  it.each(["zizi", "trfc-ticketing", "v2-app"])("accepts %s", (slug) => expect(SLUG_PATTERN.test(slug)).toBe(true));
  it.each(["Zizi", "-zizi", "zizi-", "zi--zi", "zi zi", "zi_zi", ""])("rejects %j", (slug) =>
    expect(SLUG_PATTERN.test(slug)).toBe(false),
  );
});

describe("image URLs", () => {
  it("recognises only https Blob hosts", () => {
    expect(isBlobUrl(BLOB)).toBe(true);
    expect(isBlobUrl(BLOB.replace("https:", "http:"))).toBe(false);
    expect(isBlobUrl("https://evil.com/public.blob.vercel-storage.com/x.png")).toBe(false);
    expect(isBlobUrl("https://public.blob.vercel-storage.com.evil.com/x.png")).toBe(false);
    expect(isBlobUrl("/images/x.png")).toBe(false);
  });

  it("allows Blob and site-relative images, nothing else", () => {
    expect(imageUrlSchema.safeParse(BLOB).success).toBe(true);
    expect(imageUrlSchema.safeParse("/images/portrait.jpg").success).toBe(true);
    expect(imageUrlSchema.safeParse("//evil.com/x.png").success).toBe(false);
    expect(imageUrlSchema.safeParse("https://example.com/x.png").success).toBe(false);
  });

  it("collects unique Blob URLs and ignores local ones", () => {
    const input = validInput();
    input.listScreenshot.image = BLOB;
    input.caseStudy.hero.image = BLOB;
    input.caseStudy.gallery[0].image = "/images/local.png";
    expect(imageUrlsOf(input)).toEqual([BLOB]);
  });
});

describe("projectInputSchema", () => {
  it("accepts a complete project", () => {
    expect(projectInputSchema.safeParse(validInput()).success).toBe(true);
  });

  it("dedupes tags case-insensitively, keeping the first spelling", () => {
    const result = projectInputSchema.parse({ ...validInput(), tags: ["Next.js", "Prisma", "next.js", "PRISMA"] });
    expect(result.tags).toEqual(["Next.js", "Prisma"]);
  });

  it("turns empty links into null and rejects non-https links", () => {
    const result = projectInputSchema.parse({ ...validInput(), liveUrl: "", repoUrl: "  " });
    expect(result.liveUrl).toBeNull();
    expect(result.repoUrl).toBeNull();
    expect(projectInputSchema.safeParse({ ...validInput(), liveUrl: "http://zizi.app" }).success).toBe(false);
    expect(projectInputSchema.safeParse({ ...validInput(), liveUrl: "https://localhost" }).success).toBe(false);
  });

  it("reports errors by dotted path", () => {
    const input = validInput();
    input.title = "";
    input.caseStudy.gallery[1].caption = "";
    input.tags = [];
    const result = projectInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(projectErrors(result.error))).toEqual(
        expect.arrayContaining(["title", "tags", "caseStudy.gallery.1.caption"]),
      );
    }
  });

  it("enforces list limits", () => {
    expect(projectInputSchema.safeParse({ ...validInput(), features: Array(7).fill("x") }).success).toBe(false);
    expect(projectInputSchema.safeParse({ ...validInput(), tags: Array.from({ length: 9 }, (_, i) => `t${i}`) }).success).toBe(
      false,
    );
  });

  it("the empty form is invalid until filled in", () => {
    expect(projectInputSchema.safeParse(emptyProjectValues()).success).toBe(false);
  });
});

describe("seed data", () => {
  it.each(projects.map((project) => [project.slug, project] as const))("%s passes the dashboard rules", (_slug, project) => {
    const result = seedProjectRow(project);
    expect(result.ok ? [] : result.errors).toEqual([]);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
