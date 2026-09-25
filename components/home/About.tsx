import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { about } from "@/lib/data/home";

export function About() {
  return (
    <section id="about" aria-label="About" className="scroll-mt-16 border-y border-border bg-surface lg:scroll-mt-20">
      <div className="container-page flex flex-col gap-10 py-16 md:py-20 lg:flex-row lg:gap-20 lg:pt-20 lg:pb-[120px]">
        <Reveal className="lg:w-[520px] lg:shrink-0">
          <SectionHeader label={about.label} title={about.title} />
        </Reveal>

        <Reveal delay={100} className="flex min-w-0 flex-1 flex-col gap-8">
          <p className="text-[18px] leading-[1.6] text-text md:text-[20px]">{about.lead}</p>
          <p className="text-[16px] leading-[1.6] text-muted md:text-[18px]">{about.body}</p>
          <dl className="flex flex-wrap gap-x-12 gap-y-8">
            {about.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-[14px] text-muted">{stat.label}</dt>
                <dd className="font-mono text-[28px] font-bold text-accent-text md:text-[32px]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
