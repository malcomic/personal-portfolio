import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/projects", priority: 0.9 },
    { path: "/contact", priority: 0.7 },
  ];

  return [
    ...pages.map(({ path, priority }) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
