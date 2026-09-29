import { z } from "zod";

/**
 * Viewport sizes per image slot. Their aspect ratios match the frames in
 * components/projects/ScreenshotPlaceholder.tsx (576/260, 1280/450, 342/220).
 * Captures run at 2x density and are then scaled to at most 2400px wide.
 */
export const slotSizes = {
  card: { width: 1440, height: 650 },
  hero: { width: 1600, height: 562 },
  gallery: { width: 1200, height: 772 },
} as const;

export const shotNames = ["card", "hero", "gallery1", "gallery2"] as const;
export type ShotName = (typeof shotNames)[number];

export const slotFor = (shot: ShotName) => (shot === "gallery1" || shot === "gallery2" ? "gallery" : shot);

const selector = z.string().min(1);

const shotSchema = z.object({
  /** Page to capture. */
  url: z.url(),
  /** Wait until this selector is visible before capturing. */
  waitFor: selector.optional(),
  /** Hidden with `visibility: hidden` (cookie banners, chat widgets). */
  hide: z.array(selector).default([]),
  /** Covered with a solid box (names, phone numbers, amounts). */
  mask: z.array(selector).default([]),
  /** Scrolled into view before capturing. */
  scrollTo: selector.optional(),
  /** Extra settle time after loading, for charts and animations. */
  delayMs: z.number().int().min(0).max(15000).default(800),
});

const projectSchema = z.object({
  /** Must match the project's slug in the database. */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Uses the session saved by `npm run screenshots:login -- --slug <slug>`. */
  auth: z.boolean().default(false),
  /** Where `screenshots:login` opens; defaults to the first shot's URL. */
  loginUrl: z.url().optional(),
  colorScheme: z.enum(["dark", "light"]).default("dark"),
  shots: z.strictObject({
    card: shotSchema.optional(),
    hero: shotSchema.optional(),
    gallery1: shotSchema.optional(),
    gallery2: shotSchema.optional(),
  }),
});

export const screenshotConfigSchema = z.array(projectSchema);
export type ScreenshotProject = z.output<typeof projectSchema>;

/*
 * Filled in from the questionnaires in content/questionnaires/. Example:
 *
 * {
 *   slug: "zizi",
 *   auth: true,
 *   loginUrl: "https://app.example.com/login",
 *   colorScheme: "dark",
 *   shots: {
 *     card: { url: "https://app.example.com/dashboard", waitFor: "[data-chart]" },
 *     hero: { url: "https://app.example.com/dashboard", mask: [".customer-name"] },
 *     gallery1: { url: "https://app.example.com/yields", scrollTo: "#forecast" },
 *     gallery2: { url: "https://app.example.com/sync-log", hide: ["#intercom-container"] },
 *   },
 * },
 */
export const screenshotConfig: z.input<typeof screenshotConfigSchema> = [];
