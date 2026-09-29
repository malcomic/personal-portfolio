import "./zod-config";
import { z } from "zod";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export function isBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const isSiteRelative = (value: string) => value.startsWith("/") && !value.startsWith("//");

export const imageUrlSchema = z
  .string()
  .refine((value) => isBlobUrl(value) || isSiteRelative(value), "Images must be uploaded to Vercel Blob.");

export const screenshotSchema = z.object({
  caption: z.string(),
  image: imageUrlSchema.optional(),
});

const titledBlockSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const caseStudySchema = z.object({
  draft: z.boolean(),
  headline: z.string(),
  tagline: z.string(),
  facts: z.object({
    client: z.string(),
    role: z.string(),
    technologies: z.string(),
    delivery: z.string(),
  }),
  hero: screenshotSchema,
  problem: z.string(),
  built: z.string(),
  gallery: z.tuple([screenshotSchema, screenshotSchema]),
  architecture: z.array(titledBlockSchema),
  challenges: z.array(titledBlockSchema),
});

export type StoredCaseStudy = z.infer<typeof caseStudySchema>;

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `Enter ${label}.`)
    .max(max, `Keep ${label} under ${max} characters.`);

const optionalHttpsUrl = z
  .string()
  .trim()
  .max(500, "Keep the URL under 500 characters.")
  .refine((value) => value === "" || isHttpsUrl(value), "Enter a full URL starting with https://.")
  .transform((value) => (value === "" ? null : value));

const screenshotInputSchema = z.object({
  caption: text("a caption (also used as alt text)", 200),
  image: imageUrlSchema.optional(),
});

const titledBlockInputSchema = z.object({
  title: text("a title", 100),
  body: text("a description", 600),
});

const blockList = (label: string) =>
  z
    .array(titledBlockInputSchema)
    .min(1, `Add at least one ${label} item.`)
    .max(6, `Keep ${label} to 6 items or fewer.`);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectInputSchema = z.object({
  title: text("a title", 80),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a URL slug.")
    .max(60, "Keep the slug under 60 characters.")
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens, like my-project."),
  subtitle: text("a subtitle", 120),
  status: text("a status label", 30),
  description: text("a home card description", 400),
  listDescription: text("a projects page description", 400),
  features: z
    .array(text("a feature", 200))
    .min(1, "Add at least one feature.")
    .max(6, "Keep features to 6 or fewer."),
  tags: z
    .array(text("a tag", 30))
    .min(1, "Add at least one tag.")
    .max(8, "Keep tags to 8 or fewer.")
    .transform((tags) => tags.filter((tag, index) => tags.findIndex((t) => t.toLowerCase() === tag.toLowerCase()) === index)),
  liveUrl: optionalHttpsUrl,
  repoUrl: optionalHttpsUrl,
  featured: z.boolean(),
  published: z.boolean(),
  listScreenshot: screenshotInputSchema,
  caseStudy: z.object({
    draft: z.boolean(),
    headline: text("a headline", 80),
    tagline: text("a tagline", 200),
    facts: z.object({
      client: text("the client", 120),
      role: text("your role", 120),
      technologies: text("the technologies", 120),
      delivery: text("the delivery date or state", 120),
    }),
    hero: screenshotInputSchema,
    problem: text("the problem", 3000),
    built: text("what you built", 3000),
    gallery: z.tuple([screenshotInputSchema, screenshotInputSchema]),
    architecture: blockList("architecture"),
    challenges: blockList("challenge"),
  }),
});

export type ProjectFormValues = z.input<typeof projectInputSchema>;
export type ProjectInput = z.output<typeof projectInputSchema>;
export type ProjectFieldErrors = Record<string, string>;

const emptyBlock = () => ({ title: "", body: "" });

export function emptyProjectValues(): ProjectFormValues {
  return {
    title: "",
    slug: "",
    subtitle: "",
    status: "",
    description: "",
    listDescription: "",
    features: [""],
    tags: [],
    liveUrl: "",
    repoUrl: "",
    featured: false,
    published: false,
    listScreenshot: { caption: "" },
    caseStudy: {
      draft: true,
      headline: "",
      tagline: "",
      facts: { client: "", role: "", technologies: "", delivery: "" },
      hero: { caption: "" },
      problem: "",
      built: "",
      gallery: [{ caption: "" }, { caption: "" }],
      architecture: [emptyBlock()],
      challenges: [emptyBlock()],
    },
  };
}

export function projectErrors(error: z.ZodError): ProjectFieldErrors {
  const result: ProjectFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

type WithImages = {
  listScreenshot: { image?: string };
  caseStudy: { hero: { image?: string }; gallery: readonly { image?: string }[] };
};

export function imageUrlsOf(input: WithImages): string[] {
  const urls = [input.listScreenshot.image, input.caseStudy.hero.image, ...input.caseStudy.gallery.map((s) => s.image)];
  return [...new Set(urls.filter((url): url is string => !!url && isBlobUrl(url)))];
}
