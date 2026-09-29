import type { Metadata } from "next";
import Link from "next/link";
import { MessageStatusBadge } from "@/components/dashboard/MessageStatusBadge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { projects } from "@/lib/data/projects";
import { formatRelative } from "@/lib/format";
import { getMessageCounts, getRecentMessages } from "@/lib/queries/messages";

export const metadata: Metadata = {
  title: "Overview",
};

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <>
      <span className="font-mono text-[12px] text-muted">{label}</span>
      <span className="font-display text-[32px] leading-none font-extrabold text-text">{value}</span>
    </>
  );
  const classes = "flex flex-col gap-4 rounded-[4px] border border-border bg-surface p-5";

  return href ? (
    <Link href={href} className={`${classes} transition-colors hover:border-muted`}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

export default async function DashboardPage() {
  const [counts, recent] = await Promise.all([getMessageCounts(), getRecentMessages(5)]);

  return (
    <div className="flex max-w-[960px] flex-col gap-10">
      <PageHeader title="Overview" description="Enquiries and portfolio content at a glance." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="NEW MESSAGES" value={counts.NEW} href="/dashboard/messages?status=NEW" />
        <StatCard label="TOTAL MESSAGES" value={counts.ALL} href="/dashboard/messages?status=ALL" />
        <StatCard label="PROJECTS" value={projects.length} />
      </div>

      <section aria-labelledby="latest-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="latest-heading" className="text-[16px] font-semibold text-text">
            Latest enquiries
          </h2>
          {recent.length > 0 && (
            <Link href="/dashboard/messages" className="font-mono text-[13px] text-muted hover:text-text">
              View all messages
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <p className="rounded-[4px] border border-dashed border-border p-8 text-center text-[14px] text-muted">
            No messages yet. Enquiries from the contact form will appear here.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-[4px] border border-border bg-surface">
            {recent.map((message) => (
              <li key={message.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/dashboard/messages/${message.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-hover-overlay"
                >
                  <span className="min-w-0 truncate text-[14px] text-text">
                    <span className={message.status === "NEW" ? "font-semibold" : undefined}>
                      {message.name ?? message.email}
                    </span>
                    {message.name && <span className="text-muted"> · {message.email}</span>}
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="hidden font-mono text-[12px] text-muted sm:inline">
                      {formatRelative(message.createdAt)}
                    </span>
                    <MessageStatusBadge status={message.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
