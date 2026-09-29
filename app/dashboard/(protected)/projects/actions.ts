"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { getBlobToken } from "@/lib/env";
import { Prisma } from "@/lib/generated/prisma/client";
import { revalidateProjects } from "@/lib/revalidate";
import {
  imageUrlsOf,
  projectErrors,
  projectInputSchema,
  type ProjectFieldErrors,
  type ProjectInput,
} from "@/lib/validation/project";

export type ProjectActionResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; fieldErrors?: ProjectFieldErrors };

type SimpleResult = { ok: true } | { ok: false; error: string };

const idSchema = z.cuid();
const NOT_FOUND = "This project no longer exists.";
const DUPLICATE_SLUG = "Another project already uses this slug.";

function prismaCode(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined;
}

function toRowData(input: ProjectInput) {
  return {
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    status: input.status,
    description: input.description,
    listDescription: input.listDescription,
    listScreenshot: input.listScreenshot,
    features: input.features,
    tags: input.tags,
    liveUrl: input.liveUrl,
    repoUrl: input.repoUrl,
    images: imageUrlsOf(input),
    caseStudy: input.caseStudy,
    featured: input.featured,
    published: input.published,
  };
}

function deleteBlobsLater(urls: string[]) {
  if (urls.length === 0) return;
  after(async () => {
    const token = getBlobToken();
    if (!token) {
      console.warn("BLOB_READ_WRITE_TOKEN is not set; leaving unused images in Blob storage.", urls);
      return;
    }
    try {
      await del(urls, { token });
    } catch (error) {
      console.error("Failed to delete unused project images", urls, error);
    }
  });
}

function refresh() {
  revalidateProjects();
  revalidatePath("/dashboard", "layout");
}

function invalid(error: z.ZodError): ProjectActionResult {
  return { ok: false, error: "Some fields need attention.", fieldErrors: projectErrors(error) };
}

export async function createProject(values: unknown): Promise<ProjectActionResult> {
  await verifySession();
  const parsed = projectInputSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  try {
    const db = getDb();
    const { _max } = await db.project.aggregate({ _max: { sortOrder: true } });
    const created = await db.project.create({
      data: { ...toRowData(parsed.data), sortOrder: (_max.sortOrder ?? -1) + 1 },
      select: { id: true, slug: true },
    });
    refresh();
    return { ok: true, ...created };
  } catch (error) {
    if (prismaCode(error) === "P2002") {
      return { ok: false, error: DUPLICATE_SLUG, fieldErrors: { slug: DUPLICATE_SLUG } };
    }
    console.error("Could not create project", error);
    return { ok: false, error: "Could not create the project." };
  }
}

export async function updateProject(id: string, values: unknown): Promise<ProjectActionResult> {
  await verifySession();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid request." };
  const parsed = projectInputSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  try {
    const db = getDb();
    const current = await db.project.findUnique({ where: { id: parsedId.data }, select: { images: true } });
    if (!current) return { ok: false, error: NOT_FOUND };

    const data = toRowData(parsed.data);
    const updated = await db.project.update({
      where: { id: parsedId.data },
      data,
      select: { id: true, slug: true },
    });
    deleteBlobsLater(current.images.filter((url) => !data.images.includes(url)));
    refresh();
    return { ok: true, ...updated };
  } catch (error) {
    const code = prismaCode(error);
    if (code === "P2002") return { ok: false, error: DUPLICATE_SLUG, fieldErrors: { slug: DUPLICATE_SLUG } };
    if (code === "P2025") return { ok: false, error: NOT_FOUND };
    console.error("Could not update project", error);
    return { ok: false, error: "Could not save the project." };
  }
}

export async function deleteProject(id: string): Promise<SimpleResult> {
  await verifySession();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Invalid request." };

  try {
    const deleted = await getDb().project.delete({ where: { id: parsedId.data }, select: { images: true } });
    deleteBlobsLater(deleted.images);
  } catch (error) {
    if (prismaCode(error) === "P2025") return { ok: false, error: NOT_FOUND };
    console.error("Could not delete project", error);
    return { ok: false, error: "Could not delete the project." };
  }

  refresh();
  return { ok: true };
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<SimpleResult> {
  await verifySession();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success || (direction !== "up" && direction !== "down")) {
    return { ok: false, error: "Invalid request." };
  }

  try {
    const db = getDb();
    const rows = await db.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, sortOrder: true },
    });
    const index = rows.findIndex((row) => row.id === parsedId.data);
    if (index === -1) return { ok: false, error: NOT_FOUND };
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= rows.length) return { ok: true };

    const ordered = [...rows];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    // Renumber everything so rows that shared a sortOrder end up in a stable, distinct order.
    const updates = ordered
      .map((row, position) => ({ ...row, position }))
      .filter((row) => row.sortOrder !== row.position)
      .map((row) => db.project.update({ where: { id: row.id }, data: { sortOrder: row.position } }));
    await db.$transaction(updates);
  } catch (error) {
    console.error("Could not reorder projects", error);
    return { ok: false, error: "Could not reorder the projects." };
  }

  refresh();
  return { ok: true };
}

export async function setProjectPublished(id: string, published: boolean): Promise<SimpleResult> {
  await verifySession();
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success || typeof published !== "boolean") return { ok: false, error: "Invalid request." };

  try {
    await getDb().project.update({ where: { id: parsedId.data }, data: { published } });
  } catch (error) {
    if (prismaCode(error) === "P2025") return { ok: false, error: NOT_FOUND };
    console.error("Could not change project visibility", error);
    return { ok: false, error: "Could not change the project's visibility." };
  }

  refresh();
  return { ok: true };
}
