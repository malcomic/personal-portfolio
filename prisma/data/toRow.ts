import type { Project } from "../../lib/data/projects";
import { projectRowData, type ProjectRowData } from "../../lib/project-row";
import { projectErrors, projectInputSchema } from "../../lib/validation/project";

export type SeedResult =
  | { ok: true; slug: string; data: ProjectRowData }
  | { ok: false; slug: string; errors: Record<string, string> };

/** Validates a seed entry with the same rules as the dashboard form and maps it to column values. */
export function seedProjectRow(project: Project): SeedResult {
  const { liveUrl, repoUrl, ...caseStudy } = project.caseStudy;
  const parsed = projectInputSchema.safeParse({
    ...project,
    liveUrl: liveUrl ?? "",
    repoUrl: repoUrl ?? "",
    published: true,
    caseStudy,
  });
  if (!parsed.success) return { ok: false, slug: project.slug, errors: projectErrors(parsed.error) };
  return { ok: true, slug: project.slug, data: projectRowData(parsed.data) };
}

export function formatSeedErrors(results: SeedResult[]) {
  return results
    .filter((result): result is Extract<SeedResult, { ok: false }> => !result.ok)
    .map((result) => {
      const lines = Object.entries(result.errors).map(([path, message]) => `    ${path}: ${message}`);
      return `  ${result.slug}\n${lines.join("\n")}`;
    })
    .join("\n");
}
