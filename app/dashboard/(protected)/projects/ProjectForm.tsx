"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { ActionButton, actionButtonClasses } from "@/components/dashboard/ActionButton";
import { Field, fieldId, TextArea, TextInput, Toggle } from "@/components/dashboard/fields";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { ListEditor } from "@/components/dashboard/ListEditor";
import { TagInput } from "@/components/dashboard/TagInput";
import { slugify } from "@/lib/text";
import {
  projectErrors,
  projectInputSchema,
  type ProjectFieldErrors,
  type ProjectFormValues,
} from "@/lib/validation/project";
import { createProject, updateProject } from "./actions";

type ProjectFormProps = {
  projectId?: string;
  initialValues: ProjectFormValues;
  invalidStoredData?: boolean;
};

const FIXED_LABELS: Record<string, string> = {
  title: "Title",
  slug: "URL slug",
  subtitle: "Subtitle",
  status: "Status label",
  description: "Home card description",
  listDescription: "Projects page description",
  features: "Home card features",
  tags: "Tags",
  liveUrl: "Live URL",
  repoUrl: "Repository URL",
  "listScreenshot.caption": "Projects page image caption",
  "listScreenshot.image": "Projects page image",
  "caseStudy.headline": "Headline",
  "caseStudy.tagline": "Tagline",
  "caseStudy.facts.client": "Client",
  "caseStudy.facts.role": "Role",
  "caseStudy.facts.technologies": "Technologies",
  "caseStudy.facts.delivery": "Delivery",
  "caseStudy.hero.caption": "Hero image caption",
  "caseStudy.hero.image": "Hero image",
  "caseStudy.problem": "The problem",
  "caseStudy.built": "What I built",
  "caseStudy.architecture": "Architecture",
  "caseStudy.challenges": "Challenges",
};

function describeError(path: string): { label: string; target: string } {
  if (FIXED_LABELS[path]) return { label: FIXED_LABELS[path], target: fieldId(path) };
  const parts = path.split(".");
  if (parts[0] === "tags") return { label: `Tag ${Number(parts[1]) + 1}`, target: fieldId("tags") };
  if (parts[0] === "features") return { label: `Feature ${Number(parts[1]) + 1}`, target: fieldId(path) };
  if (parts[1] === "gallery") {
    return { label: `Gallery image ${Number(parts[2]) + 1} ${parts[3] === "image" ? "" : "caption"}`.trim(), target: fieldId(path) };
  }
  if (parts[1] === "architecture" || parts[1] === "challenges") {
    const name = parts[1] === "architecture" ? "Architecture" : "Challenge";
    return { label: `${name} ${Number(parts[2]) + 1} ${parts[3] ?? ""}`.trim(), target: fieldId(path) };
  }
  return { label: path, target: fieldId(path) };
}

function setIn<T>(target: T, keys: string[], value: unknown): T {
  if (keys.length === 0) return value as T;
  const [key, ...rest] = keys;
  if (Array.isArray(target)) {
    const copy = [...target];
    copy[Number(key)] = setIn(copy[Number(key)], rest, value);
    return copy as T;
  }
  const record = target as Record<string, unknown>;
  return { ...record, [key]: setIn(record[key], rest, value) } as T;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5 rounded-[4px] border border-border bg-surface p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="text-[16px] font-semibold text-text">
          {title}
        </h2>
        {description && <p className="text-[13px] text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

const emptyBlock = () => ({ title: "", body: "" });

export function ProjectForm({ projectId, initialValues, invalidStoredData = false }: ProjectFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProjectFieldErrors>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(projectId));
  const [dirty, setDirty] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [submitAttempt, setSubmitAttempt] = useState(0);
  const [saved, setSaved] = useState(projectId ? { slug: initialValues.slug, published: initialValues.published } : null);
  const [isPending, startTransition] = useTransition();
  const summaryRef = useRef<HTMLDivElement>(null);

  const errorEntries = Object.entries(errors);

  useEffect(() => {
    if (submitAttempt > 0) summaryRef.current?.focus();
  }, [submitAttempt]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function setAt(path: string, value: unknown) {
    setValues((current) => setIn(current, path.split("."), value));
    setErrors((current) => {
      const keys = Object.keys(current).filter((key) => key === path || key.startsWith(`${path}.`));
      if (keys.length === 0) return current;
      const next = { ...current };
      for (const key of keys) delete next[key];
      return next;
    });
    setDirty(true);
  }

  function onTitleChange(title: string) {
    setAt("title", title);
    if (!slugTouched) setAt("slug", slugify(title).slice(0, 60));
  }

  const err = (path: string) => errors[path];
  const firstErrorUnder = (prefix: string) =>
    errors[prefix] ?? errorEntries.find(([key]) => key.startsWith(`${prefix}.`))?.[1];
  const onBusyChange = (busy: boolean) => setUploads((count) => count + (busy ? 1 : -1));
  const imageErrors = (path: string) => ({ caption: err(`${path}.caption`), image: err(`${path}.image`) });
  const imageSlug = values.slug || "untitled";

  function showErrors(fieldErrors: ProjectFieldErrors) {
    setErrors(fieldErrors);
    setSubmitAttempt((count) => count + 1);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || uploads > 0) return;

    const parsed = projectInputSchema.safeParse(values);
    if (!parsed.success) {
      showErrors(projectErrors(parsed.error));
      return;
    }

    startTransition(async () => {
      const result = projectId ? await updateProject(projectId, values) : await createProject(values);
      if (!result.ok) {
        if (result.fieldErrors) showErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }

      setErrors({});
      setDirty(false);
      if (projectId) {
        setSaved({ slug: result.slug, published: values.published });
        toast.success("Changes saved");
        router.refresh();
      } else {
        toast.success("Project created");
        router.replace(`/dashboard/projects/${result.id}/edit`);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={isPending} className="flex max-w-[880px] flex-col gap-6">
      {invalidStoredData && (
        <p role="status" className="rounded-[4px] border border-dashed border-accent p-4 text-[14px] text-accent-text">
          Some stored case-study data for this project could not be read, so those fields start empty. Saving will
          replace the stored data with what you enter here.
        </p>
      )}

      {errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="form-error-summary-title"
          className="flex flex-col gap-3 rounded-[4px] border border-accent p-4 focus:outline-none"
        >
          <p id="form-error-summary-title" className="text-[14px] font-semibold text-text">
            {errorEntries.length === 1 ? "1 field needs attention" : `${errorEntries.length} fields need attention`}
          </p>
          <ul className="flex flex-col gap-1">
            {errorEntries.map(([path, message]) => {
              const { label, target } = describeError(path);
              return (
                <li key={path} className="text-[13px]">
                  <a href={`#${target}`} className="text-accent-text underline underline-offset-2">
                    {label}
                  </a>
                  <span className="text-muted">: {message}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Section title="Basics" description="How the project is named and whether it appears on the public site.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput path="title" label="TITLE" value={values.title} onChange={onTitleChange} error={err("title")} maxLength={80} />
          <TextInput
            path="slug"
            label="URL SLUG"
            value={values.slug}
            onChange={(slug) => {
              setSlugTouched(true);
              setAt("slug", slug);
            }}
            error={err("slug")}
            maxLength={60}
            hint={
              saved?.published && saved.slug !== values.slug
                ? "Changing the slug breaks existing links to this case study."
                : `Public URL: /projects/${values.slug || "..."}`
            }
          />
          <TextInput
            path="subtitle"
            label="SUBTITLE"
            value={values.subtitle}
            onChange={(value) => setAt("subtitle", value)}
            error={err("subtitle")}
            maxLength={120}
          />
          <TextInput
            path="status"
            label="STATUS LABEL"
            value={values.status}
            onChange={(value) => setAt("status", value)}
            error={err("status")}
            maxLength={30}
            placeholder="LIVE MVP"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle
            label="Published"
            description="Visible on the public site."
            checked={values.published}
            onChange={(checked) => setAt("published", checked)}
          />
          <Toggle
            label="Featured"
            description="Shown on the home page."
            checked={values.featured}
            onChange={(checked) => setAt("featured", checked)}
          />
          <Toggle
            label="Draft case study"
            description="Shows a draft notice in development."
            checked={values.caseStudy.draft}
            onChange={(checked) => setAt("caseStudy.draft", checked)}
          />
        </div>
      </Section>

      <Section title="Cards" description="The home page card (featured projects) and the entry on the /projects page.">
        <TextArea
          path="description"
          label="HOME CARD DESCRIPTION"
          value={values.description}
          onChange={(value) => setAt("description", value)}
          error={err("description")}
          maxLength={400}
          rows={3}
        />
        <ListEditor
          path="features"
          label="HOME CARD FEATURES"
          itemLabel="Feature"
          items={values.features}
          onChange={(items) => setAt("features", items)}
          create={() => ""}
          max={6}
          error={err("features")}
          renderItem={(feature, index) => (
            <TextInput
              path={`features.${index}`}
              label="FEATURE"
              value={feature}
              onChange={(value) => setAt(`features.${index}`, value)}
              error={err(`features.${index}`)}
              maxLength={200}
            />
          )}
        />
        <TextArea
          path="listDescription"
          label="PROJECTS PAGE DESCRIPTION"
          value={values.listDescription}
          onChange={(value) => setAt("listDescription", value)}
          error={err("listDescription")}
          maxLength={400}
          rows={3}
        />
        <Field path="tags" label="TECH STACK TAGS" hint="Press Enter or comma to add a tag. Up to 8." error={firstErrorUnder("tags")}>
          {(control) => (
            <TagInput
              {...control}
              value={values.tags}
              onChange={(tags) => setAt("tags", tags)}
              max={8}
              maxLength={30}
              placeholder="Next.js"
            />
          )}
        </Field>
        <ImageUpload
          path="listScreenshot"
          label="PROJECTS PAGE IMAGE"
          variant="card"
          sizes="(min-width: 1024px) 560px, 100vw"
          slug={imageSlug}
          value={values.listScreenshot}
          onImageChange={(url) => setAt("listScreenshot.image", url)}
          onCaptionChange={(caption) => setAt("listScreenshot.caption", caption)}
          onBusyChange={onBusyChange}
          errors={imageErrors("listScreenshot")}
        />
      </Section>

      <Section title="Links" description="Optional. Shown as buttons on the case study.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            path="liveUrl"
            label="LIVE URL"
            type="url"
            value={values.liveUrl}
            onChange={(value) => setAt("liveUrl", value)}
            error={err("liveUrl")}
            placeholder="https://example.com"
          />
          <TextInput
            path="repoUrl"
            label="REPOSITORY URL"
            type="url"
            value={values.repoUrl}
            onChange={(value) => setAt("repoUrl", value)}
            error={err("repoUrl")}
            placeholder="https://github.com/..."
          />
        </div>
      </Section>

      <Section title="Case study" description="The full /projects/[slug] page.">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput
            path="caseStudy.headline"
            label="HEADLINE"
            value={values.caseStudy.headline}
            onChange={(value) => setAt("caseStudy.headline", value)}
            error={err("caseStudy.headline")}
            maxLength={80}
          />
          <TextInput
            path="caseStudy.tagline"
            label="TAGLINE"
            value={values.caseStudy.tagline}
            onChange={(value) => setAt("caseStudy.tagline", value)}
            error={err("caseStudy.tagline")}
            maxLength={200}
          />
          {(["client", "role", "technologies", "delivery"] as const).map((fact) => (
            <TextInput
              key={fact}
              path={`caseStudy.facts.${fact}`}
              label={fact.toUpperCase()}
              value={values.caseStudy.facts[fact]}
              onChange={(value) => setAt(`caseStudy.facts.${fact}`, value)}
              error={err(`caseStudy.facts.${fact}`)}
              maxLength={120}
            />
          ))}
        </div>

        <ImageUpload
          path="caseStudy.hero"
          label="HERO IMAGE"
          variant="hero"
          sizes="(min-width: 1024px) 800px, 100vw"
          slug={imageSlug}
          value={values.caseStudy.hero}
          onImageChange={(url) => setAt("caseStudy.hero.image", url)}
          onCaptionChange={(caption) => setAt("caseStudy.hero.caption", caption)}
          onBusyChange={onBusyChange}
          errors={imageErrors("caseStudy.hero")}
        />

        <TextArea
          path="caseStudy.problem"
          label="THE PROBLEM"
          value={values.caseStudy.problem}
          onChange={(value) => setAt("caseStudy.problem", value)}
          error={err("caseStudy.problem")}
          maxLength={3000}
          rows={6}
        />
        <TextArea
          path="caseStudy.built"
          label="WHAT I BUILT"
          value={values.caseStudy.built}
          onChange={(value) => setAt("caseStudy.built", value)}
          error={err("caseStudy.built")}
          maxLength={3000}
          rows={6}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {([0, 1] as const).map((index) => (
            <ImageUpload
              key={index}
              path={`caseStudy.gallery.${index}`}
              label={`GALLERY IMAGE ${index + 1}`}
              variant="gallery"
              sizes="(min-width: 1024px) 400px, 100vw"
              slug={imageSlug}
              value={values.caseStudy.gallery[index]}
              onImageChange={(url) => setAt(`caseStudy.gallery.${index}.image`, url)}
              onCaptionChange={(caption) => setAt(`caseStudy.gallery.${index}.caption`, caption)}
              onBusyChange={onBusyChange}
              errors={imageErrors(`caseStudy.gallery.${index}`)}
            />
          ))}
        </div>

        {(["architecture", "challenges"] as const).map((list) => (
          <ListEditor
            key={list}
            path={`caseStudy.${list}`}
            label={list === "architecture" ? "ARCHITECTURE" : "CHALLENGES"}
            itemLabel={list === "architecture" ? "Architecture item" : "Challenge"}
            items={values.caseStudy[list]}
            onChange={(items) => setAt(`caseStudy.${list}`, items)}
            create={emptyBlock}
            max={6}
            error={err(`caseStudy.${list}`)}
            renderItem={(block, index) => (
              <div className="flex flex-col gap-4">
                <TextInput
                  path={`caseStudy.${list}.${index}.title`}
                  label="TITLE"
                  value={block.title}
                  onChange={(value) => setAt(`caseStudy.${list}.${index}.title`, value)}
                  error={err(`caseStudy.${list}.${index}.title`)}
                  maxLength={100}
                />
                <TextArea
                  path={`caseStudy.${list}.${index}.body`}
                  label="DESCRIPTION"
                  value={block.body}
                  onChange={(value) => setAt(`caseStudy.${list}.${index}.body`, value)}
                  error={err(`caseStudy.${list}.${index}.body`)}
                  maxLength={600}
                  rows={3}
                />
              </div>
            )}
          />
        ))}
      </Section>

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-border bg-bg/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <ActionButton type="submit" variant="primary" pending={isPending} disabled={uploads > 0}>
          {isPending ? "Saving..." : projectId ? "Save changes" : "Create project"}
        </ActionButton>
        <Link href="/dashboard/projects" className={actionButtonClasses("secondary")}>
          {dirty ? "Cancel" : "Back to projects"}
        </Link>
        {saved?.published && (
          <a
            href={`/projects/${saved.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-muted hover:text-text"
          >
            View on site
          </a>
        )}
        <span aria-live="polite" className="ml-auto font-mono text-[12px] text-muted">
          {uploads > 0 ? "Waiting for uploads to finish..." : dirty ? "Unsaved changes" : ""}
        </span>
      </div>
    </form>
  );
}
