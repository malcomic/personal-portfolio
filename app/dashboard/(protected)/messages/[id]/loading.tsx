import { SkeletonBlock } from "@/components/dashboard/TableSkeleton";

export default function MessageLoading() {
  return (
    <div aria-busy className="flex max-w-[860px] flex-col gap-8">
      <span className="sr-only">Loading</span>
      <SkeletonBlock className="h-4 w-32" />
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-8 w-64" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-36" />
          <SkeletonBlock className="h-10 w-24" />
          <SkeletonBlock className="h-10 w-32" />
        </div>
      </div>
      <SkeletonBlock className="h-32 w-full" />
      <SkeletonBlock className="h-48 w-full" />
    </div>
  );
}
