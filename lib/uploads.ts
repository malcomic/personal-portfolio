import { slugify } from "@/lib/text";

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"] as const;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Must stay in sync with the path check in app/api/projects/upload/route.ts. */
export function uploadPathFor(projectSlug: string, fileName: string) {
  const dot = fileName.lastIndexOf(".");
  const extension = dot > 0 ? fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = slugify(dot > 0 ? fileName.slice(0, dot) : fileName).slice(0, 40) || "image";
  const folder = slugify(projectSlug) || "untitled";
  return `projects/${folder}/${base}${extension ? `.${extension}` : ""}`;
}
