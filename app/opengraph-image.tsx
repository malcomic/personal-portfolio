import { ImageResponse } from "next/og";
import { hero } from "@/lib/data/home";
import { loadOgFonts, OgFrame, ogColors, ogContentType, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} | ${site.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        badge={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: ogColors.accent }} />
            <span style={{ fontFamily: "Geist Mono", fontSize: 22 }}>{site.availability}</span>
          </div>
        }
        footer={
          <span style={{ fontSize: 26, color: ogColors.muted }}>
            {site.role} · {site.location}
          </span>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontFamily: "Geist Mono", fontSize: 24, color: ogColors.accent }}>{hero.eyebrow}</span>
          <span style={{ fontFamily: "Syne", fontSize: 80, lineHeight: 1.05, maxWidth: 1000 }}>{hero.title}</span>
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
