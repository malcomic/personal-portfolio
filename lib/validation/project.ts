import { z } from "zod";

export const screenshotSchema = z.object({
  caption: z.string(),
  image: z.string().optional(),
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
