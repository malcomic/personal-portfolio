import { SkeletonBlock, TableSkeleton } from "@/components/dashboard/TableSkeleton";

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <SkeletonBlock className="h-10 w-32" />
      </div>
      <TableSkeleton rows={5} columns={5} />
    </div>
  );
}
