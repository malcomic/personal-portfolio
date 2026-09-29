"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { safeEqual } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { clientIpHash } from "@/lib/ip";
import { createSession, deleteSession } from "@/lib/session";

const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

export type LoginState = { error: string; email?: string } | undefined;

function safeNext(next: string | undefined) {
  if (next && /^\/dashboard(\/|\?|$)/.test(next) && !next.startsWith("/dashboard/login")) return next;
  return "/dashboard";
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter your email and password." };
  const { email, password, next } = parsed.data;

  try {
    const env = getEnv();
    const db = getDb();
    const ipHash = clientIpHash(await headers());

    const failures = await db.loginAttempt.count({
      where: { ipHash, success: false, createdAt: { gte: new Date(Date.now() - ATTEMPT_WINDOW_MS) } },
    });
    if (failures >= MAX_FAILED_ATTEMPTS) return { error: "Too many attempts, try again later.", email };

    // Compare the password even when the email is wrong so response time does not reveal which one failed.
    const passwordHash = Buffer.from(env.ADMIN_PASSWORD_HASH, "base64").toString("utf8");
    const passwordMatches = await bcrypt.compare(password, passwordHash);
    const emailMatches = safeEqual(email, env.ADMIN_EMAIL.toLowerCase());
    const success = passwordMatches && emailMatches;

    await db.loginAttempt.create({ data: { ipHash, success } });
    if (!success) return { error: "Incorrect email or password.", email };

    await createSession();
  } catch (error) {
    console.error("Login failed", error);
    return { error: "Sign-in is unavailable right now. Try again shortly.", email };
  }

  redirect(safeNext(next));
}

export async function logoutAction() {
  await deleteSession();
  redirect("/dashboard/login");
}
