import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { sendContactAlert } from "@/lib/email";
import { getEnv } from "@/lib/env";
import { contactSchema, firstFieldErrors, type ContactResponse } from "@/lib/validation/contact";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function respond(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status });
}

function clientIpHash(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${getEnv().IP_HASH_SALT}:${ip}`).digest("hex");
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respond({ ok: false, error: "Invalid request." }, 400);
  }

  if (body && typeof body === "object" && "company" in body && body.company) {
    return respond({ ok: true }, 201);
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return respond(
      { ok: false, error: "Please fix the highlighted fields.", fieldErrors: firstFieldErrors(result.error) },
      422,
    );
  }

  const { name, email, projectType, details } = result.data;

  try {
    const db = getDb();
    const ipHash = clientIpHash(request);
    const recent = await db.message.count({
      where: { ipHash, createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) } },
    });
    if (recent >= RATE_LIMIT_MAX) {
      return respond({ ok: false, error: "Too many messages, please try again in a few minutes." }, 429);
    }

    const message = await db.message.create({
      data: { name: name || null, email, projectType: projectType ?? null, details, ipHash },
    });

    after(() => sendContactAlert(message));
    return respond({ ok: true }, 201);
  } catch (error) {
    console.error("Failed to save contact message", error);
    return respond({ ok: false, error: "Something went wrong sending your message." }, 500);
  }
}
