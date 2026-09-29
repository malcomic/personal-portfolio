import type { Metadata } from "next";
import Link from "next/link";
import { actionButtonClasses } from "@/components/dashboard/ActionButton";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata: Metadata = {
  title: "Not found",
};

export default function DashboardNotFound() {
  return (
    <div className="flex max-w-[560px] flex-col gap-6">
      <PageHeader
        title="Not found"
        description="This dashboard page doesn't exist, or the item was deleted."
      />
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className={actionButtonClasses("primary")}>
          Overview
        </Link>
        <Link href="/dashboard/messages" className={actionButtonClasses()}>
          Messages
        </Link>
        <Link href="/dashboard/projects" className={actionButtonClasses()}>
          Projects
        </Link>
      </div>
    </div>
  );
}
