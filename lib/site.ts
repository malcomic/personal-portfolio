export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = NavLink & {
  external?: boolean;
};

export type ContactLink = SocialLink & {
  display: string;
  icon: "mail" | "github" | "linkedin";
};

export const site = {
  name: "Malcom",
  wordmark: "MALCOM",
  version: "v2.5.0",
  build: "[BUILD: 24.12.A]",
  role: "Full-Stack Software Engineer",
  location: "Nairobi, Kenya / Cambridge, UK",
  description:
    "Kenya-based full-stack software engineer building and shipping web apps, payment flows and data-driven SaaS dashboards.",
  url: "https://malcomrono.site",
  email: "malcom@bomahut.com",
  github: "https://github.com/malcom-dev",
  linkedin: "https://www.linkedin.com/in/malcom-bomahut",
  cv: "/cv.pdf",
  availability: "Available for freelance",
  copyright: "Malcom. Engineered from scratch. All rights reserved.",
  keywords: [
    "Full-Stack Software Engineer",
    "Next.js developer",
    "React",
    "M-Pesa integration",
    "SaaS development",
    "Nairobi",
    "Kenya",
  ],
} as const;

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: site.github, external: true },
  { label: "LinkedIn", href: site.linkedin, external: true },
  { label: "Email", href: `mailto:${site.email}` },
  { label: "CV / Resume", href: site.cv, external: true },
];

export const contactLinks: ContactLink[] = [
  { label: "Email", icon: "mail", href: `mailto:${site.email}`, display: site.email },
  { label: "GitHub", icon: "github", href: site.github, display: "github.com/malcom-dev", external: true },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: site.linkedin,
    display: "linkedin.com/in/malcom-bomahut",
    external: true,
  },
];
