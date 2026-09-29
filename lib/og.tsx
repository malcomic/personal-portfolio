import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import type { ReactNode } from "react";
import sharp from "sharp";
import { site } from "@/lib/site";
import { isBlobUrl } from "@/lib/validation/project";

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

export const ogPanelSize = { width: 560, height: ogSize.height };

async function readImage(src: string) {
  if (isBlobUrl(src)) {
    const response = await fetch(src, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
  const publicDir = join(process.cwd(), "public");
  const file = join(publicDir, src);
  if (!src.startsWith("/") || relative(publicDir, file).startsWith("..")) throw new Error("Not a public file");
  return readFile(file);
}

/** Satori can't decode WebP or AVIF, so screenshots are re-encoded as a JPEG data URL cropped to the side panel. */
export async function loadOgPanelImage(src: string | undefined): Promise<string | undefined> {
  if (!src) return undefined;
  try {
    const jpeg = await sharp(await readImage(src))
      .resize(ogPanelSize.width, ogPanelSize.height, { fit: "cover", position: "left top" })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch (error) {
    console.error(`OG image: could not load ${src}`, error);
    return undefined;
  }
}

type OgFrameProps = { badge: ReactNode; children: ReactNode; footer: ReactNode; panelImage?: string };

export function OgFrame({ badge, children, footer, panelImage }: OgFrameProps) {
  return (
    <div
      style={{
        position: "relative",
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
      {panelImage && (
        <div style={{ position: "absolute", top: 0, right: 0, display: "flex", ...ogPanelSize }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- rendered by Satori, not the browser */}
          <img src={panelImage} width={ogPanelSize.width} height={ogPanelSize.height} style={{ opacity: 0.45 }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              ...ogPanelSize,
              display: "flex",
              backgroundImage: `linear-gradient(90deg, ${ogColors.bg} 0%, rgba(10,10,10,0.6) 45%, rgba(10,10,10,0) 100%)`,
            }}
          />
        </div>
      )}
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
