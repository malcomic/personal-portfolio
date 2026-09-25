import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillGroups, skillsIntro, type SkillGroup } from "@/lib/data/skills";

function SkillCard({ group }: { group: SkillGroup }) {
  return (
    <article className="flex h-full flex-col gap-6 rounded-[4px] border border-border bg-surface p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-[20px] font-bold text-text">{group.title}</h3>
        <Icon name={group.icon} />
      </div>
      <ul className="flex flex-col gap-3">
        {group.items.map((item) => (
          <li key={item} className="flex items-center gap-2 font-mono text-[14px] text-text">
            <span aria-hidden className="size-1 shrink-0 bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-label="Skills" className="scroll-mt-16 bg-bg lg:scroll-mt-20">
      <div className="container-page flex flex-col gap-12 py-16 md:gap-16 md:py-24 lg:py-[120px]">
        <Reveal>
          <SectionHeader
            label={skillsIntro.label}
            title={skillsIntro.title}
            description={skillsIntro.description}
            descriptionClassName="max-w-[640px]"
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 80} className="h-full">
              <SkillCard group={group} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
