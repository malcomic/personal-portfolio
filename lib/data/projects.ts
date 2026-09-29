export type Screenshot = {
  caption: string;
  image?: string;
};

export type CaseStudy = {
  draft: boolean;
  headline: string;
  tagline: string;
  liveUrl?: string;
  repoUrl?: string;
  facts: {
    client: string;
    role: string;
    technologies: string;
    delivery: string;
  };
  hero: Screenshot;
  problem: string;
  built: string;
  gallery: [Screenshot, Screenshot];
  architecture: { title: string; body: string }[];
  challenges: { title: string; body: string }[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  status: string;
  featured: boolean;
  description: string;
  listDescription: string;
  listScreenshot: Screenshot;
  features: string[];
  tags: string[];
  caseStudy: CaseStudy;
};

export const projectsIntro = {
  label: "03 / Portfolio",
  title: "Selected Venturing",
  archivePrompt: "See the full project archive",
};

export const projectsPage = {
  label: "03 / Portfolio",
  title: "Sovereign Ventures",
  description: "A full architectural catalog of production-proven applications built for operational resilience.",
};
