import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { actionButtonClasses } from "@/components/dashboard/ActionButton";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { formatDateTime, formatRelative } from "@/lib/format";
import { listProjectsForAdmin, type AdminProjectRow } from "@/lib/queries/projects";
import { ProjectRowActions } from "./ProjectRowActions";

export const metadata: Metadata = {
  title: "Projects",
};

function Badge({ tone = "muted", children }: { tone?: "accent" | "muted" | "text"; children: ReactNode }) {
  const tones = {
    accent: "border-accent/25 bg-accent/10 text-accent-text",
    text: "border-border bg-surface text-text",
    muted: "border-border bg-transparent text-muted",
  };
  return (
    <span className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 font-mono text-[12px] leading-5 whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}

function ProjectBadges({ project }: { project: AdminProjectRow }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge tone={project.published ? "text" : "muted"}>{project.published ? "Published" : "Hidden"}</Badge>
      {project.featured && <Badge tone="accent">Featured</Badge>}
      {project.draft && <Badge>Draft</Badge>}
      {!project.valid && <Badge tone="accent">Invalid data</Badge>}
    </div>
  );
}

export default async function ProjectsPage() {
  const projects = await listProjectsForAdmin();
  const publishedCount = projects.filter((project) => project.published).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Projects" description={`${publishedCount} published · ${projects.length} total`}>
        <Link href="/dashboard/projects/new" className={actionButtonClasses("primary")}>
          New project
        </Link>
      </PageHeader>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[4px] border border-dashed border-border p-10 text-center">
          <p className="text-[14px] text-muted">
            No projects yet. Add your first one, or run <code className="font-mono text-text">npm run db:seed</code> to
            import the originals.
          </p>
          <Link href="/dashboard/projects/new" className={actionButtonClasses("secondary")}>
            New project
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[4px] border border-border bg-surface lg:block">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-border font-mono text-[12px] text-muted">
                <tr>
                  <th scope="col" className="w-12 px-5 py-3 font-normal">#</th>
                  <th scope="col" className="px-5 py-3 font-normal">PROJECT</th>
                  <th scope="col" className="px-5 py-3 font-normal">STATE</th>
                  <th scope="col" className="px-5 py-3 font-normal">UPDATED</th>
                  <th scope="col" className="px-5 py-3 font-normal">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-4 align-top font-mono text-[12px] text-muted">{index + 1}</td>
                    <td className="px-5 py-4 align-top">
                      <Link href={`/dashboard/projects/${project.id}/edit`} className="font-semibold text-text hover:text-accent-text">
                        {project.title}
                      </Link>
                      <span className="block text-[13px] text-muted">
                        {project.subtitle} · <span className="font-mono text-[12px]">{project.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <ProjectBadges project={project} />
                    </td>
                    <td className="px-5 py-4 align-top font-mono text-[12px] whitespace-nowrap text-muted" title={formatDateTime(project.updatedAt)}>
                      {formatRelative(project.updatedAt)}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <ProjectRowActions
                        id={project.id}
                        title={project.title}
                        published={project.published}
                        isFirst={index === 0}
                        isLast={index === projects.length - 1}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 lg:hidden">
            {projects.map((project, index) => (
              <li key={project.id} className="flex flex-col gap-3 rounded-[4px] border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/dashboard/projects/${project.id}/edit`} className="font-semibold text-text hover:text-accent-text">
                      {project.title}
                    </Link>
                    <span className="block text-[13px] text-muted">{project.subtitle}</span>
                  </div>
                  <span className="font-mono text-[12px] text-muted">#{index + 1}</span>
                </div>
                <ProjectBadges project={project} />
                <span className="font-mono text-[12px] text-muted">Updated {formatRelative(project.updatedAt)}</span>
                <ProjectRowActions
                  id={project.id}
                  title={project.title}
                  published={project.published}
                  isFirst={index === 0}
                  isLast={index === projects.length - 1}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
