/** Only same-site dashboard paths are allowed as post-login destinations. */
export function safeNext(next: string | undefined) {
  if (next && /^\/dashboard(\/|\?|$)/.test(next) && !next.startsWith("/dashboard/login")) return next;
  return "/dashboard";
}
