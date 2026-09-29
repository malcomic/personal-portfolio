import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyBody } from "@/components/projects/CaseStudyBody";
import { CaseStudyHero } from "@/components/projects/CaseStudyHero";
import { FactsStrip } from "@/components/projects/FactsStrip";
import { ProjectPager } from "@/components/projects/ProjectPager";
import { pageMetadata } from "@/lib/metadata";
import { getAdjacentProjects, getProjectBySlug, getPublishedProjects } from "@/lib/queries/projects";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return pageMetadata({
    title: `${project.title}: ${project.subtitle}`,
    description: project.caseStudy.tagline,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { previous, next } = await getAdjacentProjects(slug);

  return (
    <>
      <CaseStudyHero project={project} />
      <FactsStrip facts={project.caseStudy.facts} />
      <CaseStudyBody caseStudy={project.caseStudy} />
      {previous && next && <ProjectPager previous={previous} next={next} />}
    </>
  );
}
