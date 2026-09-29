"use client";

import { useEffect } from "react";
import { ActionButton } from "@/components/dashboard/ActionButton";

export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex max-w-[560px] flex-col items-start gap-4 rounded-[4px] border border-border bg-surface p-6">
      <h1 className="font-display text-[22px] font-extrabold text-text">Could not load dashboard data</h1>
      <p className="text-[14px] leading-[1.6] text-muted">
        The database may be unreachable. Check your connection settings, then try again.
      </p>
      {error.digest && <p className="font-mono text-[12px] text-muted">Error reference: {error.digest}</p>}
      <ActionButton variant="primary" onClick={() => retry()}>
        Retry
      </ActionButton>
    </div>
  );
}
