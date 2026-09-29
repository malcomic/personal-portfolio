import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { verifySession } from "@/lib/dal";
import { emptyProjectValues } from "@/lib/validation/project";
import { ProjectForm } from "../ProjectForm";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  await verifySession();

  return (
    <div className="flex flex-col gap-8">
      <Link href="/dashboard/projects" className="font-mono text-[13px] text-muted hover:text-text">
        ← All projects
      </Link>
      <PageHeader title="New project" description="New projects start hidden, so you can finish them before publishing." />
      <ProjectForm initialValues={emptyProjectValues()} />
    </div>
  );
}
