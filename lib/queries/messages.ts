import "server-only";
import { cache } from "react";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import type { Prisma } from "@/lib/generated/prisma/client";
import { MessageStatus } from "@/lib/generated/prisma/enums";

export const PAGE_SIZE = 20;
const PREVIEW_LENGTH = 140;

export const messageFilters = ["INBOX", "NEW", "REPLIED", "ARCHIVED", "ALL"] as const;
export type MessageFilter = (typeof messageFilters)[number];

const firstValue = (value: unknown) => (Array.isArray(value) ? value[0] : value);

const filtersSchema = z.object({
  status: z.preprocess(firstValue, z.enum(messageFilters).catch("INBOX")).default("INBOX"),
  q: z.preprocess(firstValue, z.string().trim().max(200).catch("")).default(""),
  page: z.preprocess(firstValue, z.coerce.number().int().min(1).catch(1)).default(1),
});

export type MessageListParams = z.infer<typeof filtersSchema>;

export function parseMessageFilters(searchParams: Record<string, string | string[] | undefined>): MessageListParams {
  return filtersSchema.parse(searchParams);
}

function statusWhere(status: MessageFilter): Prisma.MessageWhereInput {
  if (status === "ALL") return {};
  if (status === "INBOX") return { status: { not: MessageStatus.ARCHIVED } };
  return { status };
}

export async function getMessageCounts() {
  await verifySession();
  const groups = await getDb().message.groupBy({ by: ["status"], _count: { _all: true } });
  const count = (status: MessageStatus) => groups.find((group) => group.status === status)?._count._all ?? 0;
  const counts = { NEW: count("NEW"), REPLIED: count("REPLIED"), ARCHIVED: count("ARCHIVED") };
  return { ...counts, INBOX: counts.NEW + counts.REPLIED, ALL: counts.NEW + counts.REPLIED + counts.ARCHIVED };
}

export async function listMessages({ status, q, page }: MessageListParams) {
  await verifySession();
  const where: Prisma.MessageWhereInput = {
    ...statusWhere(status),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { details: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  const db = getDb();
  const total = await db.message.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = await db.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: { id: true, name: true, email: true, projectType: true, details: true, status: true, createdAt: true },
  });

  const items = rows.map(({ details, ...row }) => ({
    ...row,
    preview: details.length > PREVIEW_LENGTH ? `${details.slice(0, PREVIEW_LENGTH).trimEnd()}...` : details,
  }));

  return { items, total, page: currentPage, pageCount };
}

export const getMessage = cache(async (id: string) => {
  await verifySession();
  return getDb().message.findUnique({ where: { id } });
});

export async function getRecentMessages(limit = 5) {
  await verifySession();
  return getDb().message.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, name: true, email: true, status: true, createdAt: true },
  });
}
