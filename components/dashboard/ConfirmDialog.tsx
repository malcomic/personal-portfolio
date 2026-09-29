"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { ActionButton } from "./ActionButton";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({ open, title, children, confirmLabel, pending = false, onConfirm, onClose }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        if (pending) event.preventDefault();
      }}
      className="m-auto w-[min(440px,calc(100%-40px))] rounded-[4px] border border-border bg-surface p-6 text-text backdrop:bg-black/60"
    >
      <div className="flex flex-col gap-4">
        <h2 id={titleId} className="font-display text-[20px] font-extrabold">
          {title}
        </h2>
        <div className="text-[14px] leading-[1.6] text-muted">{children}</div>
        <div className="flex justify-end gap-3 pt-2">
          <ActionButton onClick={onClose} disabled={pending} autoFocus>
            Cancel
          </ActionButton>
          <ActionButton variant="danger" pending={pending} onClick={onConfirm}>
            {confirmLabel}
          </ActionButton>
        </div>
      </div>
    </dialog>
  );
}
