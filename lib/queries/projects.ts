import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import type { Project } from "@/lib/data/projects";
import type { Project as ProjectRow } from "@/lib/generated/prisma/client";
import { caseStudySchema, screenshotSchema } from "@/lib/validation/project";

export function toProject(row: ProjectRow): Project | null {
  const listScreenshot = screenshotSchema.safeParse(row.listScreenshot);
  const caseStudy = caseStudySchema.safeParse(row.caseStudy);
  if (!listScreenshot.success || !caseStudy.success) {
    const issues = [...(listScreenshot.error?.issues ?? []), ...(caseStudy.error?.issues ?? [])];
    console.error(`Skipping project "${row.slug}": invalid stored JSON.`, issues);
    return null;
  }

  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    status: row.status,
    featured: row.featured,
    description: row.description,
    listDescription: row.listDescription,
    listScreenshot: listScreenshot.data,
    features: row.features,
    tags: row.tags,
    caseStudy: {
      ...caseStudy.data,
      liveUrl: row.liveUrl ?? undefined,
      repoUrl: row.repoUrl ?? undefined,
    },
  };
}

export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  const rows = await getDb().project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toProject).filter((project) => project !== null);
});

export async function getFeaturedProjects() {
  const projects = await getPublishedProjects();
  return projects.filter((project) => project.featured);
}

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const row = await getDb().project.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return toProject(row);
});

export async function getAdjacentProjects(slug: string) {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  const count = projects.length;
  if (index === -1 || count < 2) return { previous: undefined, next: undefined };
  return {
    previous: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}

export async function getProjectCount() {
  await verifySession();
  return getDb().project.count();
}
