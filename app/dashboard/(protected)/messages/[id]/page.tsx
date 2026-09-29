import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { MessageStatusBadge } from "@/components/dashboard/MessageStatusBadge";
import { formatDateTime, formatRelative } from "@/lib/format";
import { getMessage } from "@/lib/queries/messages";
import { MessageActions } from "./MessageActions";

export async function generateMetadata({ params }: PageProps<"/dashboard/messages/[id]">): Promise<Metadata> {
  const message = await getMessage((await params).id);
  return { title: message ? `Message from ${message.name ?? message.email}` : "Message not found" };
}

export default async function MessagePage({ params }: PageProps<"/dashboard/messages/[id]">) {
  const message = await getMessage((await params).id);
  if (!message) notFound();

  const meta: [string, ReactNode][] = [
    [
      "EMAIL",
      <a key="email" href={`mailto:${message.email}`} className="break-all text-text underline underline-offset-4 hover:text-accent-text">
        {message.email}
      </a>,
    ],
    ["PROJECT TYPE", message.projectType ?? "Not specified"],
    ["RECEIVED", `${formatDateTime(message.createdAt)} (${formatRelative(message.createdAt)})`],
  ];
  if (message.repliedAt) meta.push(["REPLIED", formatDateTime(message.repliedAt)]);

  return (
    <div className="flex max-w-[860px] flex-col gap-8">
      <Link href="/dashboard/messages" className="font-mono text-[13px] text-muted hover:text-text">
        &larr; Back to messages
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[28px] leading-tight font-extrabold break-words text-text">
            {message.name ?? message.email}
          </h1>
          <MessageStatusBadge status={message.status} />
        </div>
        <MessageActions
          id={message.id}
          status={message.status}
          hasReplied={message.repliedAt !== null}
          email={message.email}
          details={message.details}
        />
      </div>

      <dl className="grid gap-4 rounded-[4px] border border-border bg-surface p-5 sm:grid-cols-2">
        {meta.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="font-mono text-[12px] text-muted">{label}</dt>
            <dd className="text-[14px] text-text">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="message-body-heading" className="flex flex-col gap-3">
        <h2 id="message-body-heading" className="font-mono text-[12px] text-muted">
          MESSAGE
        </h2>
        <p className="rounded-[4px] border border-border bg-surface p-5 text-[15px] leading-[1.7] break-words whitespace-pre-wrap text-text">
          {message.details}
        </p>
      </section>
    </div>
  );
}
