import { imageUrlsOf, type ProjectInput } from "./validation/project";

/** Column values for a validated project. Used by the dashboard actions and the content scripts. */
export function projectRowData(input: ProjectInput) {
  return {
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    status: input.status,
    description: input.description,
    listDescription: input.listDescription,
    listScreenshot: input.listScreenshot,
    features: input.features,
    tags: input.tags,
    liveUrl: input.liveUrl,
    repoUrl: input.repoUrl,
    images: imageUrlsOf(input),
    caseStudy: input.caseStudy,
    featured: input.featured,
    published: input.published,
  };
}

export type ProjectRowData = ReturnType<typeof projectRowData>;
