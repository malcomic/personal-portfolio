import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { loadOgFonts, OgFrame, ogColors, ogContentType, ogSize } from "@/lib/og";
import { getProjectBySlug, getPublishedProjects } from "@/lib/queries/projects";
import { longestWordLength } from "@/lib/text";

export const alt = "Case study preview";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const titleSize = Math.min(96, Math.floor(1000 / longestWordLength(project.caseStudy.headline)));

  return new ImageResponse(
    (
      <OgFrame
        badge={
          <span style={{ fontFamily: "Geist Mono", fontSize: 22, color: ogColors.muted }}>CASE STUDY</span>
        }
        footer={
          <div style={{ display: "flex", gap: 10 }}>
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "Geist Mono",
                  fontSize: 20,
                  color: ogColors.muted,
                  background: ogColors.surface,
                  border: `1px solid ${ogColors.border}`,
                  borderRadius: 2,
                  padding: "6px 14px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
          <span
            style={{
              fontFamily: "Geist Mono",
              fontSize: 20,
              color: ogColors.accent,
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.25)",
              borderRadius: 2,
              padding: "6px 14px",
            }}
          >
            {project.status}
          </span>
          <span style={{ fontFamily: "Syne", fontSize: titleSize, lineHeight: 1.05 }}>{project.caseStudy.headline}</span>
          <span style={{ fontSize: 34, color: ogColors.accent }}>{project.subtitle}</span>
          <span style={{ fontSize: 26, color: ogColors.muted, maxWidth: 1000 }}>{project.caseStudy.tagline}</span>
        </div>
      </OgFrame>
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
