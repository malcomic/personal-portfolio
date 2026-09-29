import Link from "next/link";
import type { CSSProperties } from "react";
import { ScreenshotPlaceholder } from "@/components/projects/ScreenshotPlaceholder";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/data/projects";
import { longestWordLength } from "@/lib/text";

type ProjectListCardProps = {
  project: Project;
  preload?: boolean;
};

export function ProjectListCard({ project, preload = false }: ProjectListCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid gap-8 rounded-[4px] border border-border bg-surface p-6 transition-[transform,border-color] duration-300 ease-out hover:border-border-strong hover:[transform:perspective(1000px)_rotateX(1deg)_translateY(-4px)] focus-visible:border-border-strong motion-reduce:transition-[border-color] motion-reduce:hover:transform-none md:p-10 lg:grid-cols-2 lg:gap-12"
    >
      <div className="@container flex min-w-0 flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h2
              style={{ "--longest-word": longestWordLength(project.title) } as CSSProperties}
              className="font-display text-[min(32px,calc(95cqi/var(--longest-word)))] leading-tight font-extrabold [overflow-wrap:anywhere] text-text"
            >
              {project.title}
            </h2>
            <p className="text-[16px] font-medium text-accent-text">{project.subtitle}</p>
          </div>
          <Tag tone="accent">{project.status}</Tag>
        </div>

        <p className="text-[15px] leading-[1.6] text-muted">{project.listDescription}</p>

        <ul aria-label="Tech stack" className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        <span className="flex items-center gap-2 font-mono text-[14px] text-text">
          Explore Case Study
          <Icon
            name="arrow-link"
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      <ScreenshotPlaceholder
        screenshot={project.listScreenshot}
        variant="card"
        sizes="(min-width: 1024px) 576px, 100vw"
        preload={preload}
        className="self-start"
      />
    </Link>
  );
}
