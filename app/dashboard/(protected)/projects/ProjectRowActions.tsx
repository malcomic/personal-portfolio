"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ActionButton, actionButtonClasses } from "@/components/dashboard/ActionButton";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { deleteProject, moveProject, setProjectPublished } from "./actions";

type ActionKey = "up" | "down" | "publish" | "delete";

type ProjectRowActionsProps = {
  id: string;
  title: string;
  published: boolean;
  isFirst: boolean;
  isLast: boolean;
};

const compact = "h-9 px-3 text-[13px]";

export function ProjectRowActions({ id, title, published, isFirst, isLast }: ProjectRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function run(
    key: ActionKey,
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    successMessage?: string,
  ) {
    setActiveAction(key);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        if (successMessage) toast.success(successMessage);
        if (key === "delete") setConfirmOpen(false);
      } else {
        toast.error(result.error);
      }
      setActiveAction(null);
    });
  }

  const pendingFor = (key: ActionKey) => isPending && activeAction === key;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/dashboard/projects/${id}/edit`} className={actionButtonClasses("secondary", compact)}>
        Edit<span className="sr-only"> {title}</span>
      </Link>
      <ActionButton
        className={compact}
        pending={pendingFor("up")}
        disabled={isPending || isFirst}
        aria-label={`Move ${title} up`}
        onClick={() => run("up", () => moveProject(id, "up"))}
      >
        {!pendingFor("up") && <span aria-hidden>↑</span>}
      </ActionButton>
      <ActionButton
        className={compact}
        pending={pendingFor("down")}
        disabled={isPending || isLast}
        aria-label={`Move ${title} down`}
        onClick={() => run("down", () => moveProject(id, "down"))}
      >
        {!pendingFor("down") && <span aria-hidden>↓</span>}
      </ActionButton>
      <ActionButton
        className={compact}
        pending={pendingFor("publish")}
        disabled={isPending}
        onClick={() =>
          run(
            "publish",
            () => setProjectPublished(id, !published),
            published ? `${title} is now hidden` : `${title} is now public`,
          )
        }
      >
        {published ? "Unpublish" : "Publish"}
        <span className="sr-only"> {title}</span>
      </ActionButton>
      <ActionButton variant="danger" className={compact} disabled={isPending} onClick={() => setConfirmOpen(true)}>
        Delete<span className="sr-only"> {title}</span>
      </ActionButton>

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${title}?`}
        confirmLabel="Delete project"
        pending={pendingFor("delete")}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => run("delete", () => deleteProject(id), `${title} deleted`)}
      >
        This permanently removes the project, its case study page and its uploaded images. Use Unpublish if you only
        want to hide it.
      </ConfirmDialog>
    </div>
  );
}
