import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { education, educationIntro, experienceIntro, roles } from "@/lib/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      aria-label="Experience and education"
      className="scroll-mt-16 border-y border-border bg-surface lg:scroll-mt-20"
    >
      <div className="container-page flex flex-col gap-16 py-16 md:py-20 lg:flex-row lg:gap-20 lg:pt-20 lg:pb-[120px]">
        <Reveal className="flex min-w-0 flex-1 flex-col gap-10 md:gap-12">
          <SectionHeader label={experienceIntro.label} title={experienceIntro.title} />
          <ol className="flex flex-col divide-y divide-border">
            {roles.map((role) => (
              <li key={role.company} className="flex flex-col gap-4 py-8 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <h3 className="font-display text-[20px] font-bold text-text">{role.company}</h3>
                  <p className={`font-mono text-[14px] whitespace-nowrap ${role.current ? "text-accent-text" : "text-muted"}`}>
                    {role.period}
                  </p>
                </div>
                <p className="font-mono text-[14px] text-muted">{role.title}</p>
                <p className="text-[15px] leading-[1.6] text-muted">{role.summary}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={100} className="flex flex-col gap-10 md:gap-12 lg:w-[480px] lg:shrink-0">
          <SectionHeader label={educationIntro.label} title={educationIntro.title} />
          <article className="flex flex-col gap-6 rounded-[4px] border border-border bg-bg p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[12px] text-accent-text">{education.status}</p>
              <h3 className="font-display text-[22px] font-extrabold text-text md:text-[24px]">{education.degree}</h3>
              <p className="text-[16px] text-muted">{education.school}</p>
              <p className="text-[14px] text-accent-text">{education.location}</p>
            </div>
            <p className="text-[14px] leading-[1.6] text-muted">{education.focus}</p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
