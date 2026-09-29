import { SkeletonBlock, TableSkeleton } from "@/components/dashboard/TableSkeleton";

export default function MessagesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonBlock key={index} className="h-9 w-20" />
        ))}
      </div>
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
