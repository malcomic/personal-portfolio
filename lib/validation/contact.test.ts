import { describe, expect, it } from "vitest";
import { projectTypes } from "@/lib/data/contact";
import { contactSchema, contactSchemaFull, firstFieldErrors } from "./contact";

const valid = { email: "jane@example.com", details: "I need a booking system for my clinic." };

describe("contactSchema", () => {
  it("accepts a minimal message and trims fields", () => {
    const result = contactSchema.parse({ ...valid, email: "  jane@example.com ", name: " Jane " });
    expect(result.email).toBe("jane@example.com");
    expect(result.name).toBe("Jane");
  });

  it("accepts every listed project type and rejects others", () => {
    for (const projectType of projectTypes) {
      expect(contactSchema.safeParse({ ...valid, projectType }).success).toBe(true);
    }
    expect(contactSchema.safeParse({ ...valid, projectType: "Crypto" }).success).toBe(false);
  });

  it.each([
    ["missing email", { details: valid.details }, "email"],
    ["invalid email", { ...valid, email: "not-an-email" }, "email"],
    ["too long email", { ...valid, email: `${"a".repeat(250)}@x.com` }, "email"],
    ["empty details", { ...valid, details: "   " }, "details"],
    ["short details", { ...valid, details: "Too short" }, "details"],
    ["long details", { ...valid, details: "x".repeat(5001) }, "details"],
    ["long name", { ...valid, name: "x".repeat(101) }, "name"],
  ])("rejects %s", (_label, input, field) => {
    const result = contactSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(firstFieldErrors(result.error)).toHaveProperty(field);
  });

  it("keeps the honeypot field so the route can drop bot submissions", () => {
    expect(contactSchema.parse({ ...valid, company: "Acme" }).company).toBe("Acme");
  });
});

describe("contactSchemaFull", () => {
  it("requires a name", () => {
    const result = contactSchemaFull.safeParse({ ...valid, name: "  " });
    expect(result.success).toBe(false);
    if (!result.success) expect(firstFieldErrors(result.error).name).toBe("Enter your name.");
  });
});

describe("firstFieldErrors", () => {
  it("returns only the first message per field", () => {
    const result = contactSchema.safeParse({ email: "", details: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(firstFieldErrors(result.error)).toEqual({
        email: "Enter your email address.",
        details: "Tell me a little about your project.",
      });
    }
  });
});
