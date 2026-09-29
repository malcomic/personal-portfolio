import { SkeletonBlock } from "@/components/dashboard/TableSkeleton";

export default function EditProjectLoading() {
  return (
    <div aria-busy className="flex max-w-[880px] flex-col gap-8">
      <span className="sr-only">Loading</span>
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-7 w-64" />
      {Array.from({ length: 3 }, (_, section) => (
        <div key={section} className="flex flex-col gap-5 rounded-[4px] border border-border bg-surface p-6">
          <SkeletonBlock className="h-4 w-32" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, field) => (
              <div key={field} className="flex flex-col gap-2">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-11 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
