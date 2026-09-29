import type { MessageStatus } from "@/lib/generated/prisma/enums";

const styles: Record<MessageStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "border-accent/25 bg-accent/10 text-accent-text" },
  REPLIED: { label: "Replied", className: "border-border bg-surface text-text" },
  ARCHIVED: { label: "Archived", className: "border-border bg-transparent text-muted" },
};

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const { label, className } = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 font-mono text-[12px] leading-5 whitespace-nowrap ${className}`}
    >
      {status === "REPLIED" && (
        <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      {status === "NEW" && <span aria-hidden className="size-1.5 rounded-full bg-accent" />}
      {label}
    </span>
  );
}
