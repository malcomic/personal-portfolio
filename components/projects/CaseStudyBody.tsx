import { ScreenshotPlaceholder } from "@/components/projects/ScreenshotPlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import type { CaseStudy } from "@/lib/data/projects";

const sectionHeading = "font-display text-[clamp(24px,1rem+2vw,32px)] leading-tight font-extrabold text-text";

export function CaseStudyBody({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <section aria-label="Case study" className="container-page pb-16 md:pb-24 lg:pb-[100px]">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_500px] xl:gap-20">
        <div className="flex min-w-0 flex-col gap-12">
          <Reveal className="flex flex-col gap-4">
            <h2 className={sectionHeading}>The Problem</h2>
            <p className="text-[16px] leading-[1.6] text-muted">{caseStudy.problem}</p>
          </Reveal>

          <Reveal className="flex flex-col gap-4">
            <h2 className={sectionHeading}>What I Built</h2>
            <p className="text-[16px] leading-[1.6] text-muted">{caseStudy.built}</p>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2">
            {caseStudy.gallery.map((shot) => (
              <ScreenshotPlaceholder
                key={shot.caption}
                screenshot={shot}
                variant="gallery"
                sizes="(min-width: 1440px) 380px, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </Reveal>
        </div>

        <div className="flex min-w-0 flex-col gap-12">
          <Reveal delay={100} className="flex flex-col gap-6">
            <h2 className={sectionHeading}>Core Architecture</h2>
            <ul className="flex flex-col gap-4">
              {caseStudy.architecture.map((item) => (
                <li key={item.title} className="flex flex-col gap-2">
                  <h3 className="font-mono text-[14px] font-semibold text-text">{item.title}</h3>
                  <p className="text-[14px] leading-[1.5] text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150} className="flex flex-col gap-6">
            <h2 className={sectionHeading}>Key Challenges</h2>
            <ol className="flex flex-col gap-4">
              {caseStudy.challenges.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span aria-hidden className="font-mono text-[14px] leading-[1.4] text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[15px] font-semibold text-text">{item.title}</h3>
                    <p className="text-[13px] leading-[1.5] text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
