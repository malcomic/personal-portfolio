import { Button } from "@/components/ui/Button";
import { hero } from "@/lib/data/home";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-bg">
      <div className="container-page flex flex-col gap-10 pt-16 pb-16 md:gap-12 md:pt-24 lg:pt-[120px] lg:pb-20">
        <div className="flex flex-col items-start gap-6">
          <p className="font-mono text-[14px] font-medium text-accent-text md:text-[16px]">{hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.25rem,1rem+5.5vw,5rem)] leading-[1.05] font-extrabold hyphens-auto text-text"
          >
            {hero.title}
          </h1>
          <p className="max-w-[860px] text-[18px] leading-[1.5] text-muted md:text-[20px] lg:text-[24px]">
            {hero.intro}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button href="/projects">View Projects</Button>
            <Button href="/contact" variant="secondary">
              Contact Me
            </Button>
          </div>

          <aside className="flex w-full flex-col gap-2 rounded-[4px] border border-border bg-surface p-6 lg:w-[400px]">
            <p className="font-mono text-[12px] text-accent-text">{hero.currently.label}</p>
            <p className="text-[15px] font-medium text-text">{hero.currently.role}</p>
            <p className="text-[13px] text-muted">{hero.currently.note}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
