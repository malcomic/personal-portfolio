import { describe, expect, it } from "vitest";
import { longestWordLength, slugify } from "./text";

describe("slugify", () => {
  it.each([
    ["Zizi SaaS", "zizi-saas"],
    ["  TRFC -- Ticketing!  ", "trfc-ticketing"],
    ["Crème Brûlée", "creme-brulee"],
    ["already-a-slug", "already-a-slug"],
    ["!!!", ""],
  ])("%j becomes %j", (input, expected) => expect(slugify(input)).toBe(expected));
});

describe("longestWordLength", () => {
  it("measures the longest space-separated word", () => {
    expect(longestWordLength("Dairy Farm Management")).toBe(10);
  });
});
