"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { projectTypes } from "@/lib/data/contact";
import { site } from "@/lib/site";
import { Spinner } from "@/components/ui/Spinner";
import {
  contactSchema,
  contactSchemaFull,
  firstFieldErrors,
  type ContactField,
  type ContactFieldErrors,
  type ContactResponse,
} from "@/lib/validation/contact";

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  variant?: "compact" | "full";
};

const FIELD_ORDER: ContactField[] = ["name", "email", "details"];

const panelClasses = "flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 md:p-12";

const fieldClasses =
  "w-full rounded-[2px] border bg-bg px-4 text-[14px] text-text placeholder:text-muted transition-colors duration-200 focus:border-muted focus:outline-none aria-[invalid=true]:border-accent";

const labelClasses = "font-mono text-[12px] text-muted";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="font-mono text-[12px] text-accent-text">
      {message}
    </p>
  );
}

function EmailFallback() {
  return (
    <a href={`mailto:${site.email}`} className="text-text underline underline-offset-4 hover:text-accent-text">
      {site.email}
    </a>
  );
}

export function ContactForm({ variant = "compact" }: ContactFormProps) {
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const full = variant === "full";
  const prefix = full ? "inquiry" : "contact";
  const submitting = status === "submitting";
  const id = (field: string) => `${prefix}-${field}`;
  const errorId = (field: ContactField) => `${prefix}-${field}-error`;
  const invalidProps = (field: ContactField) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function showFieldErrors(nextErrors: ContactFieldErrors) {
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const result = (full ? contactSchemaFull : contactSchema).safeParse(data);
    setFormError("");
    if (!result.success) {
      showFieldErrors(firstFieldErrors(result.error));
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, company: data.company }),
      });
      const body = (await response.json()) as ContactResponse;

      if (body.ok) {
        setStatus("success");
        return;
      }
      if (body.fieldErrors && Object.keys(body.fieldErrors).length > 0) showFieldErrors(body.fieldErrors);
      setFormError(body.error);
      setStatus("error");
    } catch {
      setFormError("Something went wrong sending your message.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={panelClasses}>
        <h3 ref={successRef} tabIndex={-1} className="font-display text-[24px] font-extrabold text-text focus:outline-none">
          Message received.
        </h3>
        <p className="text-[15px] leading-[1.6] text-muted">
          Thanks for reaching out. I&apos;ll reply to your email within 24 hours.
        </p>
        <div>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-mono text-[13px] text-text underline underline-offset-4 transition-colors hover:text-accent-text"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      aria-label="Project inquiry"
      aria-busy={submitting}
      className={panelClasses}
    >
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {full && (
        <div className="flex flex-col gap-2">
          <label htmlFor={id("name")} className={labelClasses}>
            YOUR NAME
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="e.g. John Doe"
            {...invalidProps("name")}
            className={`${fieldClasses} h-12 border-border`}
          />
          <ErrorText id={errorId("name")} message={errors.name} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={id("email")} className={labelClasses}>
          EMAIL ADDRESS
        </label>
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your.email@domain.com"
          {...invalidProps("email")}
          className={`${fieldClasses} h-12 border-border`}
        />
        <ErrorText id={errorId("email")} message={errors.email} />
      </div>

      {full && (
        <div className="flex flex-col gap-2">
          <label htmlFor={id("type")} className={labelClasses}>
            PROJECT TYPE
          </label>
          <div className="relative">
            <select
              id={id("type")}
              name="projectType"
              defaultValue={projectTypes[0]}
              className={`${fieldClasses} h-12 cursor-pointer appearance-none border-border pr-10`}
            >
              {projectTypes.map((type) => (
                <option key={type} value={type} className="bg-surface text-text">
                  {type}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-2 -translate-y-3/4 rotate-45 border-r border-b border-muted"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={id("details")} className={labelClasses}>
          {full ? "PROJECT DETAILS & TIMELINE" : "PROJECT DETAILS"}
        </label>
        <textarea
          id={id("details")}
          name="details"
          rows={5}
          placeholder="Tell me about your product timeline, tech stack, and goals..."
          {...invalidProps("details")}
          className={`${fieldClasses} h-[120px] resize-y border-border py-4`}
        />
        <ErrorText id={errorId("details")} message={errors.details} />
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-[2px] bg-accent text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 disabled:active:scale-100"
        >
          {submitting && <Spinner />}
          {submitting ? "Sending..." : "Send Inquiry"}
        </button>
        <div role="status" aria-live="polite">
          {formError && (
            <p className="pt-4 font-mono text-[12px] leading-[1.6] text-accent-text">
              {formError} You can also email me directly at <EmailFallback />.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
