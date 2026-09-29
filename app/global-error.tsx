"use client";

import { useEffect } from "react";
import "./globals.css";

function prefersDark() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
    document.documentElement.classList.toggle("dark", prefersDark());
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-bg p-6 font-sans text-text">
        <title>Something went wrong | Malcom</title>
        <main role="alert" className="flex max-w-[560px] flex-col items-start gap-4">
          <h1 className="text-[28px] font-extrabold">Something went wrong</h1>
          <p className="text-[15px] leading-[1.6] text-muted">
            The page failed to load. Try again, or come back in a few minutes.
          </p>
          {error.digest && <p className="font-mono text-[12px] text-muted">Error reference: {error.digest}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="h-10 rounded-[4px] bg-accent px-4 text-[14px] font-semibold text-white"
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the router may be the thing that failed */}
            <a href="/" className="flex h-10 items-center rounded-[4px] border border-border px-4 text-[14px] font-semibold">
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
