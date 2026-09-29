"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ActionButton, actionButtonClasses } from "@/components/dashboard/ActionButton";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import type { MessageStatus } from "@/lib/generated/prisma/enums";
import { deleteMessage, updateMessageStatus, type ActionResult } from "../actions";

type ActionKey = "replied" | "new" | "archive" | "unarchive" | "delete";

type MessageActionsProps = {
  id: string;
  status: MessageStatus;
  hasReplied: boolean;
  email: string;
  details: string;
};

const MAX_QUOTE_LENGTH = 1500;

function replyHref(email: string, details: string) {
  const quoted = details.slice(0, MAX_QUOTE_LENGTH).split("\n").map((line) => `> ${line}`).join("\n");
  const body = `\n\n---\n${quoted}${details.length > MAX_QUOTE_LENGTH ? "\n> ..." : ""}`;
  return `mailto:${email}?subject=${encodeURIComponent("Re: your enquiry")}&body=${encodeURIComponent(body)}`;
}

export function MessageActions({ id, status, hasReplied, email, details }: MessageActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function run(key: ActionKey, action: () => Promise<ActionResult>, successMessage: string, onSuccess?: () => void) {
    setActiveAction(key);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(successMessage);
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
      setActiveAction(null);
    });
  }

  const pendingFor = (key: ActionKey) => isPending && activeAction === key;
  const setStatus = (key: ActionKey, next: MessageStatus, message: string) =>
    run(key, () => updateMessageStatus(id, next), message);

  return (
    <div className="flex flex-wrap gap-3">
      {status === "NEW" && (
        <ActionButton
          variant="primary"
          pending={pendingFor("replied")}
          disabled={isPending}
          onClick={() => setStatus("replied", "REPLIED", "Marked as replied")}
        >
          Mark as Replied
        </ActionButton>
      )}
      {status === "REPLIED" && (
        <ActionButton pending={pendingFor("new")} disabled={isPending} onClick={() => setStatus("new", "NEW", "Marked as new")}>
          Mark as New
        </ActionButton>
      )}
      {status === "ARCHIVED" ? (
        <ActionButton
          pending={pendingFor("unarchive")}
          disabled={isPending}
          onClick={() => setStatus("unarchive", hasReplied ? "REPLIED" : "NEW", "Moved back to inbox")}
        >
          Unarchive
        </ActionButton>
      ) : (
        <ActionButton
          pending={pendingFor("archive")}
          disabled={isPending}
          onClick={() => setStatus("archive", "ARCHIVED", "Moved to archive")}
        >
          Archive
        </ActionButton>
      )}

      <a href={replyHref(email, details)} className={actionButtonClasses("secondary")}>
        Reply by email
      </a>

      <ActionButton variant="danger" disabled={isPending} onClick={() => setConfirmOpen(true)}>
        Delete
      </ActionButton>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this message?"
        confirmLabel="Delete"
        pending={pendingFor("delete")}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          run("delete", () => deleteMessage(id), "Message deleted", () => {
            setConfirmOpen(false);
            router.push("/dashboard/messages");
          })
        }
      >
        This permanently removes the message from the database. Use Archive if you might need it later.
      </ConfirmDialog>
    </div>
  );
}
