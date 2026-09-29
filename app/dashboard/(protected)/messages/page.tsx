import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MessageStatusBadge } from "@/components/dashboard/MessageStatusBadge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";
import { formatDateTime, formatRelative } from "@/lib/format";
import {
  getMessageCounts,
  listMessages,
  parseMessageFilters,
  type MessageFilter,
  type MessageListParams,
} from "@/lib/queries/messages";

export const metadata: Metadata = {
  title: "Messages",
};

const tabs: { filter: MessageFilter; label: string }[] = [
  { filter: "INBOX", label: "Inbox" },
  { filter: "NEW", label: "New" },
  { filter: "REPLIED", label: "Replied" },
  { filter: "ARCHIVED", label: "Archived" },
  { filter: "ALL", label: "All" },
];

function messagesHref({ status, q, page }: Partial<MessageListParams>) {
  const params = new URLSearchParams();
  if (status && status !== "INBOX") params.set("status", status);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/dashboard/messages?${query}` : "/dashboard/messages";
}

export default async function MessagesPage({ searchParams }: PageProps<"/dashboard/messages">) {
  const filters = parseMessageFilters(await searchParams);
  const counts = await getMessageCounts();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Messages" description={`${counts.NEW} new · ${counts.ALL} total`}>
        <form role="search" action="/dashboard/messages" className="flex w-full gap-2 md:w-auto">
          {filters.status !== "INBOX" && <input type="hidden" name="status" value={filters.status} />}
          <label htmlFor="message-search" className="sr-only">
            Search messages
          </label>
          <input
            id="message-search"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search name, email or message"
            className="h-10 w-full rounded-[4px] border border-border bg-surface px-3 text-[14px] text-text placeholder:text-muted focus:border-muted focus:outline-none md:w-72"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-[4px] border border-border px-4 text-[14px] font-semibold text-text transition-colors hover:bg-hover-overlay"
          >
            Search
          </button>
        </form>
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Filter messages" className="-mx-1 overflow-x-auto">
          <ul className="flex gap-1 px-1">
            {tabs.map(({ filter, label }) => {
              const active = filters.status === filter;
              return (
                <li key={filter}>
                  <Link
                    href={messagesHref({ status: filter, q: filters.q })}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-9 items-center gap-2 rounded-[4px] border px-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                      active ? "border-border-strong bg-surface text-text" : "border-transparent text-muted hover:text-text"
                    }`}
                  >
                    {label}
                    <span className="font-mono text-[12px] text-muted">{counts[filter]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {filters.q && (
          <p className="text-[13px] text-muted">
            Results for &ldquo;{filters.q}&rdquo;{" "}
            <Link href={messagesHref({ status: filters.status })} className="text-text underline underline-offset-4">
              Clear
            </Link>
          </p>
        )}
      </div>

      <Suspense key={`${filters.status}|${filters.q}|${filters.page}`} fallback={<TableSkeleton rows={8} columns={5} />}>
        <MessageResults filters={filters} />
      </Suspense>
    </div>
  );
}

async function MessageResults({ filters }: { filters: MessageListParams }) {
  const { items, page, pageCount } = await listMessages(filters);

  if (items.length === 0) {
    return (
      <p className="rounded-[4px] border border-dashed border-border p-10 text-center text-[14px] text-muted">
        {filters.q ? "No messages match your search." : "No messages here yet."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden overflow-hidden rounded-[4px] border border-border bg-surface md:block">
        <table className="w-full table-fixed text-left text-[14px]">
          <thead className="border-b border-border font-mono text-[12px] text-muted">
            <tr>
              <th scope="col" className="w-[26%] px-5 py-3 font-normal">FROM</th>
              <th scope="col" className="w-[16%] px-5 py-3 font-normal">PROJECT TYPE</th>
              <th scope="col" className="px-5 py-3 font-normal">MESSAGE</th>
              <th scope="col" className="w-[14%] px-5 py-3 font-normal">RECEIVED</th>
              <th scope="col" className="w-[11%] px-5 py-3 font-normal">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((message) => (
              <tr
                key={message.id}
                className="relative border-b border-border transition-colors last:border-b-0 focus-within:bg-hover-overlay hover:bg-hover-overlay"
              >
                <td className="px-5 py-4 align-top">
                  <Link
                    href={`/dashboard/messages/${message.id}`}
                    className="block truncate text-text after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent focus-visible:after:outline-solid"
                  >
                    <span className={message.status === "NEW" ? "font-semibold" : undefined}>
                      {message.name ?? message.email}
                    </span>
                  </Link>
                  {message.name && <span className="block truncate text-[13px] text-muted">{message.email}</span>}
                </td>
                <td className="truncate px-5 py-4 align-top text-muted">{message.projectType ?? "—"}</td>
                <td className="px-5 py-4 align-top text-muted">
                  <span className="line-clamp-2">{message.preview}</span>
                </td>
                <td className="px-5 py-4 align-top font-mono text-[12px] text-muted" title={formatDateTime(message.createdAt)}>
                  {formatRelative(message.createdAt)}
                </td>
                <td className="px-5 py-4 align-top">
                  <MessageStatusBadge status={message.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {items.map((message) => (
          <li key={message.id}>
            <Link
              href={`/dashboard/messages/${message.id}`}
              className="flex flex-col gap-2 rounded-[4px] border border-border bg-surface p-4 transition-colors hover:bg-hover-overlay"
            >
              <span className="flex items-start justify-between gap-3">
                <span className={`min-w-0 truncate text-[14px] text-text ${message.status === "NEW" ? "font-semibold" : ""}`}>
                  {message.name ?? message.email}
                </span>
                <MessageStatusBadge status={message.status} />
              </span>
              <span className="line-clamp-2 text-[13px] text-muted">{message.preview}</span>
              <span className="font-mono text-[12px] text-muted">
                {formatRelative(message.createdAt)}
                {message.projectType && ` · ${message.projectType}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-4 font-mono text-[13px]">
          {page > 1 ? (
            <Link href={messagesHref({ ...filters, page: page - 1 })} className="text-text hover:text-accent-text">
              Previous
            </Link>
          ) : (
            <span className="text-muted/50">Previous</span>
          )}
          <span className="text-muted">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={messagesHref({ ...filters, page: page + 1 })} className="text-text hover:text-accent-text">
              Next
            </Link>
          ) : (
            <span className="text-muted/50">Next</span>
          )}
        </nav>
      )}
    </div>
  );
}
