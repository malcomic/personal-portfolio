import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/** Constant-time string comparison; hashing first makes the lengths equal. */
export function safeEqual(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}
