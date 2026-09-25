import { Reveal } from "@/components/ui/Reveal";
import type { CaseStudy } from "@/lib/data/projects";

export function FactsStrip({ facts }: { facts: CaseStudy["facts"] }) {
  const items = [
    { label: "CLIENT / VENTURE", value: facts.client },
    { label: "ROLE", value: facts.role },
    { label: "TECHNOLOGIES", value: facts.technologies },
    { label: "DELIVERY", value: facts.delivery },
  ];

  return (
    <section aria-label="Project facts" className="container-page pb-12 md:pb-16 lg:pb-20">
      <Reveal>
        <dl className="grid gap-6 rounded-[4px] border border-border bg-surface p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <dt className="font-mono text-[11px] text-accent-text">{item.label}</dt>
              <dd className="text-[16px] font-semibold text-text">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
