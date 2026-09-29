import type { Metadata } from "next";
import { ProjectListCard } from "@/components/projects/ProjectListCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects, projectsPage } from "@/lib/data/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: projectsPage.description,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <section aria-labelledby="projects-heading" className="container-page pt-16 pb-10 md:pt-20 md:pb-12 lg:pt-[100px] lg:pb-[60px]">
        <Reveal>
          <SectionHeader
            as="h1"
            id="projects-heading"
            label={projectsPage.label}
            title={projectsPage.title}
            description={projectsPage.description}
          />
        </Reveal>
      </section>

      <section aria-label="All projects" className="container-page pb-16 md:pb-24 lg:pb-[100px]">
        <ul className="flex flex-col gap-6 md:gap-10 lg:gap-[60px]">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Reveal>
                <ProjectListCard project={project} priority={index === 0} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
