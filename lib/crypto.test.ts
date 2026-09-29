import { describe, expect, it } from "vitest";
import { safeEqual } from "./crypto";

describe("safeEqual", () => {
  it("matches equal strings", () => {
    expect(safeEqual("admin@example.com", "admin@example.com")).toBe(true);
    expect(safeEqual("", "")).toBe(true);
  });

  it("rejects different strings, including different lengths", () => {
    expect(safeEqual("secret", "Secret")).toBe(false);
    expect(safeEqual("secret", "secret-longer")).toBe(false);
    expect(safeEqual("secret", "")).toBe(false);
  });
});
