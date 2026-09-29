import "server-only";
import { createHash } from "node:crypto";
import { getEnv } from "@/lib/env";

export function clientIpHash(headers: Headers) {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${getEnv().IP_HASH_SALT}:${ip}`).digest("hex");
}
