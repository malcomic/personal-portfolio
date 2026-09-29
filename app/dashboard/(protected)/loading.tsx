import { SkeletonBlock, StatCardSkeleton, TableSkeleton } from "@/components/dashboard/TableSkeleton";

export default function OverviewLoading() {
  return (
    <div className="flex max-w-[960px] flex-col gap-10">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <TableSkeleton rows={5} columns={3} />
    </div>
  );
}
