import { describe, expect, it } from "vitest";
import { safeNext } from "./redirects";

describe("safeNext", () => {
  it.each(["/dashboard", "/dashboard/messages", "/dashboard/messages?status=NEW", "/dashboard?tab=1"])(
    "allows %s",
    (next) => expect(safeNext(next)).toBe(next),
  );

  it.each([
    undefined,
    "",
    "/dashboard/login",
    "/dashboard/login?next=/dashboard",
    "/dashboardx",
    "/",
    "/projects",
    "//evil.com",
    "//evil.com/dashboard",
    "https://evil.com/dashboard",
    "javascript:alert(1)",
  ])("falls back for %j", (next) => expect(safeNext(next)).toBe("/dashboard"));
});
