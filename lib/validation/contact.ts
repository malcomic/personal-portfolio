import "./zod-config";
import { z } from "zod";
import { projectTypes } from "@/lib/data/contact";

export const contactSchema = z.object({
  name: z.string().trim().max(100, "Keep your name under 100 characters.").optional(),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Enter a shorter email address.")
    .pipe(z.email("Enter a valid email address, like name@domain.com.")),
  projectType: z.enum(projectTypes).optional(),
  details: z
    .string()
    .trim()
    .min(1, "Tell me a little about your project.")
    .min(10, "Add a few more details (at least 10 characters).")
    .max(5000, "Keep your message under 5000 characters."),
  company: z.string().optional(),
});

export const contactSchemaFull = contactSchema.extend({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Keep your name under 100 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = "name" | "email" | "details";
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactResponse = { ok: true } | { ok: false; error: string; fieldErrors?: ContactFieldErrors };

export function firstFieldErrors<T extends ContactInput>(error: z.ZodError<T>): ContactFieldErrors {
  const { fieldErrors } = z.flattenError(error);
  const result: ContactFieldErrors = {};
  for (const field of ["name", "email", "details"] as const) {
    const message = fieldErrors[field]?.[0];
    if (message) result[field] = message;
  }
  return result;
}
