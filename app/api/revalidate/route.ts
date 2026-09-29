import { NextResponse, type NextRequest } from "next/server";
import { safeEqual } from "@/lib/crypto";
import { getRevalidateSecret } from "@/lib/env";
import { revalidateProjects } from "@/lib/revalidate";

export async function POST(request: NextRequest) {
  const secret = getRevalidateSecret();
  if (!secret) {
    return NextResponse.json({ error: "Revalidation is not configured: set REVALIDATE_SECRET (32+ characters)." }, { status: 503 });
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  if (!token || !safeEqual(token, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  revalidateProjects();
  return NextResponse.json({ revalidated: true });
}
