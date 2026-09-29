"use client";

import type { ReactNode } from "react";

export const inputClasses =
  "w-full rounded-[2px] border border-border bg-bg px-3 text-[14px] text-text placeholder:text-muted transition-colors duration-200 focus:border-muted focus:outline-none aria-[invalid=true]:border-accent";

export const labelClasses = "font-mono text-[12px] text-muted";

export function fieldId(path: string) {
  return `field-${path.replace(/\./g, "-")}`;
}

export type ControlProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type FieldProps = {
  path: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  aside?: ReactNode;
  children: (control: ControlProps) => ReactNode;
};

export function Field({ path, label, hint, error, aside, children }: FieldProps) {
  const id = fieldId(path);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
        {aside}
      </div>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && (
        <p id={hintId} className="text-[12px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="font-mono text-[12px] text-accent-text">
          {error}
        </p>
      )}
    </div>
  );
}

type TextInputProps = {
  path: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: ReactNode;
  placeholder?: string;
  type?: "text" | "url";
  maxLength?: number;
};

export function TextInput({ path, label, value, onChange, error, hint, placeholder, type = "text", maxLength }: TextInputProps) {
  return (
    <Field path={path} label={label} hint={hint} error={error}>
      {(control) => (
        <input
          {...control}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClasses} h-11`}
        />
      )}
    </Field>
  );
}

type TextAreaProps = Omit<TextInputProps, "type" | "maxLength"> & { maxLength: number; rows?: number };

export function TextArea({ path, label, value, onChange, error, hint, placeholder, maxLength, rows = 4 }: TextAreaProps) {
  const over = value.length > maxLength;
  return (
    <Field
      path={path}
      label={label}
      hint={hint}
      error={error}
      aside={
        <span aria-hidden className={`font-mono text-[11px] ${over ? "text-accent-text" : "text-muted"}`}>
          {value.length}/{maxLength}
        </span>
      }
    >
      {(control) => (
        <textarea
          {...control}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClasses} resize-y py-2.5 leading-[1.6]`}
        />
      )}
    </Field>
  );
}

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 rounded-[4px] border border-border p-3 text-left transition-colors hover:bg-hover-overlay"
    >
      <span
        aria-hidden
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-border-strong"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[14px] font-medium text-text">{label}</span>
        {description && <span className="text-[12px] text-muted">{description}</span>}
      </span>
    </button>
  );
}
