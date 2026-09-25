"use client";

import { useState, type FormEvent } from "react";
import { projectTypes } from "@/lib/data/contact";
import { site } from "@/lib/site";

type Field = "name" | "email" | "details";
type Errors = Partial<Record<Field, string>>;

type ContactFormProps = {
  variant?: "compact" | "full";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function ContactForm({ variant = "compact" }: ContactFormProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const full = variant === "full";
  const prefix = full ? "inquiry" : "contact";
  const id = (field: string) => `${prefix}-${field}`;
  const errorId = (field: Field) => `${prefix}-${field}-error`;
  const invalidProps = (field: Field) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : undefined,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    const nextErrors: Errors = {};
    if (full && !name) nextErrors.name = "Enter your name.";
    if (!email) nextErrors.email = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Enter a valid email address, like name@domain.com.";
    if (!details) nextErrors.details = "Tell me a little about your project.";

    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Project inquiry"
      className="flex flex-col gap-6 rounded-[4px] border border-border bg-surface p-6 md:p-12"
    >
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
          className="flex h-12 w-full items-center justify-center rounded-[2px] bg-accent text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.98]"
        >
          Send Inquiry
        </button>
        <div role="status">
          {submitted && (
            <p className="pt-4 font-mono text-[12px] leading-[1.6] text-muted">
              Thanks! Online inquiries open soon. For now, email me directly at{" "}
              <a href={`mailto:${site.email}`} className="text-text underline underline-offset-4 hover:text-accent-text">
                {site.email}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
