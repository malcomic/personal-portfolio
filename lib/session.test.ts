import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { decrypt, isValidSession } from "./session";

const SECRET = "test-session-secret-0123456789abcdef";

function sign({ sub = "admin", secret = SECRET, expiresIn = "1h", alg = "HS256" } = {}) {
  return new SignJWT({})
    .setProtectedHeader({ alg })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(secret));
}

beforeEach(() => vi.stubEnv("SESSION_SECRET", SECRET));
afterEach(() => vi.unstubAllEnvs());

describe("session tokens", () => {
  it("accepts a valid admin token", async () => {
    const token = await sign();
    expect(await isValidSession(token)).toBe(true);
    expect((await decrypt(token))?.sub).toBe("admin");
  });

  it("rejects a missing token", async () => {
    expect(await isValidSession(undefined)).toBe(false);
    expect(await isValidSession("")).toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await sign();
    const [header, payload, signature] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "admin", exp: 9999999999 })).toString("base64url");
    expect(await isValidSession(`${header}.${forged}.${signature}`)).toBe(false);
    expect(await isValidSession(`${header}.${payload}.${signature.slice(0, -2)}xx`)).toBe(false);
  });

  it("rejects a token signed with another secret", async () => {
    expect(await isValidSession(await sign({ secret: "another-secret-0123456789abcdef0123" }))).toBe(false);
  });

  it("rejects an expired token", async () => {
    expect(await isValidSession(await sign({ expiresIn: "-1m" }))).toBe(false);
  });

  it("rejects a token for another subject", async () => {
    expect(await isValidSession(await sign({ sub: "user" }))).toBe(false);
  });

  it("rejects other algorithms", async () => {
    expect(await isValidSession(await sign({ alg: "HS512" }))).toBe(false);
  });

  it("fails closed when the secret is too short", async () => {
    const token = await sign();
    vi.stubEnv("SESSION_SECRET", "short");
    expect(await isValidSession(token)).toBe(false);
  });
});
