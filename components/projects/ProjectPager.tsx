import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/lib/data/projects";

type ProjectPagerProps = {
  previous: Project;
  next: Project;
};

export function ProjectPager({ previous, next }: ProjectPagerProps) {
  return (
    <nav aria-label="More projects" className="border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-4 py-8 font-mono text-[14px] sm:flex-row sm:items-center sm:justify-between md:py-10">
        <Link
          href={`/projects/${previous.slug}`}
          rel="prev"
          className="text-muted transition-colors hover:text-text"
        >
          PREVIOUS PROJECT: {previous.title}
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          rel="next"
          className="group flex items-center gap-3 text-text transition-colors hover:text-accent-text"
        >
          NEXT UP: {next.title}
          <Icon
            name="arrow-link"
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </nav>
  );
}
