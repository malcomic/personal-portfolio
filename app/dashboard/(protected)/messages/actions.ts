"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { Prisma } from "@/lib/generated/prisma/client";
import { MessageStatus } from "@/lib/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; error: string };

const idSchema = z.cuid();
const statusSchema = z.enum(MessageStatus);

function failure(error: unknown, fallback: string): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return { ok: false, error: "This message no longer exists." };
  }
  console.error(fallback, error);
  return { ok: false, error: fallback };
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<ActionResult> {
  await verifySession();
  const parsedId = idSchema.safeParse(id);
  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return { ok: false, error: "Invalid request." };

  try {
    const db = getDb();
    const current = await db.message.findUnique({ where: { id: parsedId.data }, select: { repliedAt: true } });
    if (!current) return { ok: false, error: "This message no longer exists." };

    const repliedAt =
      parsedStatus.data === "REPLIED" ? (current.repliedAt ?? new Date()) : parsedStatus.data === "NEW" ? null : undefined;

    await db.message.update({ where: { id: parsedId.data }, data: { status: parsedStatus.data, repliedAt } });
  } catch (error) {
    return failure(error, "Could not update the message.");
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await verifySession();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid request." };

  try {
    await getDb().message.delete({ where: { id: parsedId.data } });
  } catch (error) {
    return failure(error, "Could not delete the message.");
  }

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
