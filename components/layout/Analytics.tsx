"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function isDashboard(url: string) {
  return new URL(url, window.location.origin).pathname.startsWith("/dashboard");
}

export function Analytics() {
  return (
    <>
      <VercelAnalytics beforeSend={(event) => (isDashboard(event.url) ? null : event)} />
      <SpeedInsights beforeSend={(event) => (isDashboard(event.url) ? null : event)} />
    </>
  );
}
