import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/session";

const LOGIN_PATH = "/dashboard/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = await isValidSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    return signedIn ? NextResponse.redirect(new URL("/dashboard", request.url)) : NextResponse.next();
  }

  if (!signedIn) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
