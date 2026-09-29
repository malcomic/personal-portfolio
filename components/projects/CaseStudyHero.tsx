import Link from "next/link";
import type { CSSProperties } from "react";
import { DraftNotice } from "@/components/projects/DraftNotice";
import { ScreenshotPlaceholder } from "@/components/projects/ScreenshotPlaceholder";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/lib/data/projects";
import { longestWordLength } from "@/lib/text";

const heroButton = "px-6 py-3 text-[15px]";

export function CaseStudyHero({ project }: { project: Project }) {
  const { caseStudy } = project;
  const hasLinks = Boolean(caseStudy.liveUrl || caseStudy.repoUrl);
  const longestWord = longestWordLength(caseStudy.headline);

  return (
    <section aria-labelledby="case-study-title" className="container-page">
      <Reveal className="flex flex-col gap-6 pt-12 pb-8 md:pt-16 lg:pt-20 lg:pb-10">
        <DraftNotice draft={caseStudy.draft} />

        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-3 font-mono text-[13px]">
            <li>
              <Link href="/projects" className="text-muted transition-colors hover:text-text">
                Projects
              </Link>
            </li>
            <li aria-hidden className="text-accent-text">
              &gt;
            </li>
            <li aria-current="page" className="text-text">
              {project.title}
            </li>
          </ol>
        </nav>

        <div className="@container flex flex-wrap items-end gap-x-3 gap-y-2">
          {/* Syne 800 averages about 1em per character, so this keeps the longest word inside the container. */}
          <h1
            id="case-study-title"
            style={{ "--longest-word": longestWord } as CSSProperties}
            className="font-display text-[min(clamp(2.25rem,1rem+5vw,4rem),calc(95cqi/var(--longest-word)))] leading-[1.1] font-extrabold text-text"
          >
            {caseStudy.headline}
          </h1>
          <p className="text-[18px] leading-[1.4] text-muted md:text-[20px] lg:pb-2 lg:text-[24px]">{caseStudy.tagline}</p>
        </div>

        {hasLinks && (
          <div className="flex flex-wrap gap-4">
            {caseStudy.liveUrl && (
              <a
                href={caseStudy.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", heroButton)}
              >
                Visit Live Site
              </a>
            )}
            {caseStudy.repoUrl && (
              <a
                href={caseStudy.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", heroButton)}
              >
                GitHub Repository
              </a>
            )}
          </div>
        )}
      </Reveal>

      <Reveal delay={100} className="pb-12 md:pb-16 lg:pb-20">
        <ScreenshotPlaceholder
          screenshot={caseStudy.hero}
          variant="hero"
          sizes="(min-width: 1440px) 1280px, 100vw"
          preload
        />
      </Reveal>
    </section>
  );
}
