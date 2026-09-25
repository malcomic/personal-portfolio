import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { aboutPage } from "@/lib/data/about";
import { site } from "@/lib/site";

export function AboutIntro() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-10 md:gap-12">
      <Reveal>
        <SectionHeader as="h1" id="about-heading" label={aboutPage.label} title={aboutPage.title} />
      </Reveal>

      <Reveal delay={80} className="flex flex-col gap-6 leading-[1.6]">
        <p className="text-[18px] text-text md:text-[20px]">{aboutPage.lead}</p>
        {aboutPage.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-[16px] text-muted">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <Reveal delay={120} className="flex flex-col gap-4">
        <h2 className="font-display text-[24px] font-extrabold text-text md:text-[28px]">
          {aboutPage.workingStyleTitle}
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {aboutPage.workingStyle.map((item) => (
            <li key={item.title} className="flex flex-col gap-2">
              <h3 className="font-mono text-[14px] font-semibold text-accent-text">{item.title}</h3>
              <p className="text-[13px] leading-[1.5] text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={160}>
        <Button href={site.cv} external className="w-full sm:w-auto">
          {aboutPage.resumeLabel}
        </Button>
      </Reveal>
    </div>
  );
}
