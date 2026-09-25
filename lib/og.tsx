import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export const ogColors = {
  bg: "#0a0a0a",
  surface: "#141414",
  text: "#e5e5e5",
  muted: "#a3a3a3",
  accent: "#dc2626",
  border: "#262626",
};

export async function loadOgFonts() {
  const read = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
  const [syne, geist, geistMono] = await Promise.all([
    read("Syne-ExtraBold.woff"),
    read("Geist-Regular.woff"),
    read("GeistMono-Regular.woff"),
  ]);
  return [
    { name: "Syne", data: syne, weight: 800 as const, style: "normal" as const },
    { name: "Geist", data: geist, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: geistMono, weight: 400 as const, style: "normal" as const },
  ];
}

export function OgFrame({ badge, children, footer }: { badge: ReactNode; children: ReactNode; footer: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: ogColors.bg,
        color: ogColors.text,
        fontFamily: "Geist",
        borderTop: `8px solid ${ogColors.accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: "Syne", fontSize: 40 }}>{site.wordmark}</span>
          <span style={{ fontFamily: "Geist Mono", fontSize: 20, color: ogColors.accent }}>{site.version}</span>
        </div>
        {badge}
      </div>

      {children}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 28,
          borderTop: `1px solid ${ogColors.border}`,
        }}
      >
        {footer}
        <span style={{ fontFamily: "Geist Mono", fontSize: 22, color: ogColors.accent }}>
          {site.url.replace("https://", "")}
        </span>
      </div>
    </div>
  );
}
