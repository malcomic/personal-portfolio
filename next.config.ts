import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const onVercel = Boolean(process.env.VERCEL);
const isPreview = process.env.VERCEL_ENV === "preview";

const BLOB_HOST = "https://*.public.blob.vercel-storage.com";
const BLOB_API = "https://vercel.com/api/blob";
const VERCEL_SCRIPTS = "https://va.vercel-scripts.com";
const VERCEL_LIVE = "https://vercel.live";

// Static pages can't carry per-request nonces, so inline scripts are allowed instead.
// upgrade-insecure-requests and HSTS are Vercel-only so `next start` over plain http (e2e) keeps working.
const csp: Record<string, string[]> = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    VERCEL_SCRIPTS,
    ...(isDev ? ["'unsafe-eval'"] : []),
    ...(isPreview ? [VERCEL_LIVE] : []),
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "font-src": ["'self'", ...(isPreview ? [VERCEL_LIVE] : [])],
  "img-src": ["'self'", "data:", "blob:", BLOB_HOST, ...(isPreview ? [VERCEL_LIVE] : [])],
  "connect-src": [
    "'self'",
    BLOB_HOST,
    BLOB_API,
    `${BLOB_API}/`,
    VERCEL_SCRIPTS,
    "https://vitals.vercel-insights.com",
    ...(isPreview ? [VERCEL_LIVE, "wss://ws-us3.pusher.com"] : []),
  ],
  "frame-src": isPreview ? [VERCEL_LIVE] : ["'none'"],
};

const contentSecurityPolicy = [
  ...Object.entries(csp).map(([directive, sources]) => `${directive} ${sources.join(" ")}`),
  ...(onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(onVercel ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
];

const nextConfig: NextConfig = {
  // E2E builds read the test database, so they get their own output folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/cv.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
