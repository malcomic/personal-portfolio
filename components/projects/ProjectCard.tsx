import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import type { Project } from "@/lib/data/projects";

type ProjectCardProps = {
  project: Project;
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, headingLevel: Heading = "h3" }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group @container flex h-full flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 transition-[transform,border-color] duration-300 ease-out hover:border-border-strong hover:[transform:perspective(1000px)_rotateX(2deg)_translateY(-4px)] focus-visible:border-border-strong motion-reduce:transition-[border-color] motion-reduce:hover:transform-none md:p-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <Heading className="font-display text-[clamp(18px,6.8cqi,32px)] leading-tight font-extrabold [overflow-wrap:anywhere] text-text">
            {project.title}
          </Heading>
          <p className="text-[16px] text-accent-text">{project.subtitle}</p>
        </div>
        <Tag>{project.status}</Tag>
      </div>

      <p className="text-[15px] leading-[1.6] text-muted">{project.description}</p>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[12px] text-text">Key Features:</p>
        <ul className="flex flex-col gap-2 text-[14px] text-muted">
          {project.features.map((feature) => (
            <li key={feature} className="flex gap-1.5">
              <span aria-hidden>•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <ul aria-label="Tech stack" className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>

      <span className="mt-auto flex items-center gap-2 font-mono text-[14px] text-text">
        View Project
        <Icon
          name="arrow-up-right"
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}
