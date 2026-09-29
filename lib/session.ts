// No "server-only" import: this module is also loaded by proxy.ts, so it must stay limited to jose and next/headers.
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ADMIN_SUBJECT = "admin";

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(secret);
}

async function encrypt(expiresAt: Date) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(ADMIN_SUBJECT)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secretKey());
}

export async function decrypt(token: string | undefined): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function isValidSession(token: string | undefined) {
  return (await decrypt(token))?.sub === ADMIN_SUBJECT;
}

export async function createSession() {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const token = await encrypt(expiresAt);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
