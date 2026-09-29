const block = "animate-pulse rounded-[2px] bg-border motion-reduce:animate-none";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`${block} ${className}`} />;
}

export function TableSkeleton({ rows = 6, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div aria-busy className="overflow-hidden rounded-[4px] border border-border bg-surface">
      <span className="sr-only">Loading</span>
      <div className="flex gap-6 border-b border-border px-5 py-4">
        {Array.from({ length: columns }, (_, column) => (
          <SkeletonBlock key={column} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-center gap-6 border-b border-border px-5 py-5 last:border-b-0">
          {Array.from({ length: columns }, (_, column) => (
            <SkeletonBlock key={column} className={`h-4 flex-1 ${column === 0 ? "max-w-[220px]" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-4 rounded-[4px] border border-border bg-surface p-5">
      <span className="sr-only">Loading</span>
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-8 w-16" />
    </div>
  );
}
