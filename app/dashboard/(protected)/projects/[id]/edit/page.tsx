import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getProjectForEdit } from "@/lib/queries/projects";
import { ProjectForm } from "../../ProjectForm";

export async function generateMetadata({ params }: PageProps<"/dashboard/projects/[id]/edit">): Promise<Metadata> {
  const project = await getProjectForEdit((await params).id);
  return { title: project ? `Edit ${project.values.title}` : "Project not found" };
}

export default async function EditProjectPage({ params }: PageProps<"/dashboard/projects/[id]/edit">) {
  const project = await getProjectForEdit((await params).id);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Link href="/dashboard/projects" className="font-mono text-[13px] text-muted hover:text-text">
        ← All projects
      </Link>
      <PageHeader title={`Edit ${project.values.title}`} />
      <ProjectForm
        key={project.id}
        projectId={project.id}
        initialValues={project.values}
        invalidStoredData={project.invalidStoredData}
      />
    </div>
  );
}
