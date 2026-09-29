import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession, SESSION_COOKIE } from "@/lib/session";

async function hasSession() {
  return isValidSession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages, layouts and Server Actions: redirects to the login page when signed out. */
export const verifySession = cache(async () => {
  if (!(await hasSession())) redirect("/dashboard/login");
});

/** For Route Handlers that must answer with 401 instead of redirecting. */
export async function isAdmin() {
  return hasSession();
}
