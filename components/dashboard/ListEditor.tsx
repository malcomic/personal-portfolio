"use client";

import type { ReactNode } from "react";
import { fieldId } from "./fields";

type ListEditorProps<T> = {
  path: string;
  label: string;
  itemLabel: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  max: number;
  error?: string;
  renderItem: (item: T, index: number, update: (next: T) => void) => ReactNode;
};

const iconButton =
  "flex h-8 items-center justify-center rounded-[2px] border border-border px-2 font-mono text-[12px] text-muted transition-colors hover:bg-hover-overlay hover:text-text disabled:cursor-not-allowed disabled:opacity-40";

export function ListEditor<T>({ path, label, itemLabel, items, onChange, create, max, error, renderItem }: ListEditorProps<T>) {
  const headingId = `${fieldId(path)}-heading`;
  const errorId = `${fieldId(path)}-error`;

  const update = (index: number, next: T) => onChange(items.map((item, i) => (i === index ? next : item)));
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div
      id={fieldId(path)}
      tabIndex={-1}
      role="group"
      aria-labelledby={headingId}
      aria-describedby={error ? errorId : undefined}
      className="flex flex-col gap-3 focus:outline-none"
    >
      <p id={headingId} className="font-mono text-[12px] text-muted">
        {label}
      </p>
      <ol className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="flex flex-col gap-3 rounded-[4px] border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[12px] text-muted">
                {itemLabel} {index + 1}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={iconButton}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
                >
                  <span aria-hidden>↑</span>
                </button>
                <button
                  type="button"
                  className={iconButton}
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
                >
                  <span aria-hidden>↓</span>
                </button>
                <button
                  type="button"
                  className={iconButton}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
            {renderItem(item, index, (next) => update(index, next))}
          </li>
        ))}
      </ol>
      {error && (
        <p id={errorId} className="font-mono text-[12px] text-accent-text">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={items.length >= max}
        onClick={() => onChange([...items, create()])}
        className="self-start rounded-[4px] border border-dashed border-border px-4 py-2 text-[13px] font-medium text-text transition-colors hover:bg-hover-overlay disabled:cursor-not-allowed disabled:opacity-50"
      >
        + Add {itemLabel.toLowerCase()}
        {items.length >= max && ` (maximum ${max})`}
      </button>
    </div>
  );
}
