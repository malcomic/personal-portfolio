"use client";

import { useState, type KeyboardEvent } from "react";
import type { ControlProps } from "./fields";

type TagInputProps = ControlProps & {
  value: string[];
  onChange: (tags: string[]) => void;
  max: number;
  maxLength: number;
  placeholder?: string;
};

export function TagInput({ value, onChange, max, maxLength, placeholder, ...control }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const full = value.length >= max;

  function add(raw: string) {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (!tag) return;
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setNotice(`"${tag}" is already added.`);
      return;
    }
    if (full) {
      setNotice(`You can add up to ${max} tags.`);
      return;
    }
    onChange([...value, tag.slice(0, maxLength)]);
    setDraft("");
    setNotice(`Added ${tag}.`);
  }

  function remove(index: number) {
    const tag = value[index];
    onChange(value.filter((_, i) => i !== index));
    setNotice(`Removed ${tag}.`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      remove(value.length - 1);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex min-h-11 flex-wrap items-center gap-2 rounded-[2px] border bg-bg px-2 py-1.5 transition-colors focus-within:border-muted ${control["aria-invalid"] ? "border-accent" : "border-border"}`}
      >
        {value.length > 0 && (
          <ul className="contents">
            {value.map((tag, index) => (
              <li
                key={tag}
                className="flex items-center gap-1 rounded-[2px] border border-border bg-surface py-0.5 pr-1 pl-2 font-mono text-[12px] text-text"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${tag}`}
                  className="flex size-5 items-center justify-center rounded-[2px] text-muted hover:bg-hover-overlay hover:text-text"
                >
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          {...control}
          value={draft}
          maxLength={maxLength}
          disabled={full}
          placeholder={full ? `Maximum of ${max} tags` : placeholder}
          onChange={(event) => {
            if (event.target.value.endsWith(",")) add(event.target.value);
            else setDraft(event.target.value);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          className="h-8 min-w-[140px] flex-1 bg-transparent px-1 text-[14px] text-text placeholder:text-muted focus:outline-none"
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {notice}
      </p>
    </div>
  );
}
