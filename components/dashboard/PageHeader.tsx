import type { ReactNode } from "react";

export function PageHeader({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] leading-tight font-extrabold text-text">{title}</h1>
        {description && <p className="text-[14px] text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
