import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projectsIntro } from "@/lib/data/projects";
import { getFeaturedProjects } from "@/lib/queries/projects";

export async function Projects() {
  const featuredProjects = await getFeaturedProjects();
  const rows = [
    { items: featuredProjects.slice(0, 2), columns: "lg:grid-cols-[728fr_520fr]" },
    { items: featuredProjects.slice(2, 4), columns: "lg:grid-cols-[repeat(2,minmax(0,520px))]" },
  ];

  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-16 bg-bg lg:scroll-mt-20">
      <div className="container-page flex flex-col gap-12 py-16 md:gap-16 md:py-24 lg:gap-20 lg:pt-20 lg:pb-[120px]">
        <Reveal>
          <SectionHeader label={projectsIntro.label} title={projectsIntro.title} />
        </Reveal>

        <div className="flex flex-col gap-6 lg:gap-20">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={`grid gap-6 lg:gap-8 ${row.columns}`}>
              {row.items.map((project, index) => (
                <Reveal key={project.slug} delay={index * 100} className="h-full">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ))}
        </div>

        <Reveal className="flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-[14px] text-muted">{projectsIntro.archivePrompt}</p>
          <Button href="/projects" variant="secondary">
            View All Projects
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
