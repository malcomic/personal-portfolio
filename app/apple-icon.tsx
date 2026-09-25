import { ImageResponse } from "next/og";
import { ogColors } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ogColors.bg,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M7 24V8h3.6L16 15.4 21.4 8H25v16h-3.6V14.1L16 21.3l-5.4-7.2V24z" fill={ogColors.accent} />
        </svg>
      </div>
    ),
    size,
  );
}
