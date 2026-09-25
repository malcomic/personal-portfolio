export type ProgressEntry = {
  period: string;
  title: string;
  detail: string;
  upcoming?: boolean;
};

export const aboutPage = {
  label: "01 / Profile",
  title: "Sovereign Execution",
  description:
    "Kenya-based full-stack software engineer specializing in end-to-end web architectures, serverless infrastructure, and data integrity.",
  lead: "I am a Kenya-based software engineer specializing in end-to-end web architectures, serverless infrastructure, and data integrity.",
  paragraphs: [
    "I treat code as an operational leverage point. My approach focuses on bridging fast-rendering custom user interfaces (React, Next.js, Tailwind) with secure, transactionally sound payment bridges (M-Pesa, Paystack, Stripe) and efficient backend schemas.",
    "Starting Autumn 2025, I will pursue an MSc in Applied Data Science at Anglia Ruskin University in Cambridge, UK. My research will focus on predictive resource modeling, SaaS performance optimization, and agricultural operational intelligence.",
  ],
  workingStyleTitle: "Working Style",
  workingStyle: [
    {
      title: "// CODE IS LIQUID",
      body: "A system is only as good as its next revision. I write maintainable schemas and avoid dependencies.",
    },
    {
      title: "// SECURE AT BASE",
      body: "All transactional API layers must execute safely. End-to-end test verification prevents breaking cycles.",
    },
  ],
  resumeLabel: "Download Resume / CV (PDF)",
};

export const portrait: { src?: string; alt: string; placeholder: string } = {
  src: "/portrait.jpeg",
  alt: "Portrait of Malcom",
  placeholder: "[PORTRAIT: MALCOM]",
};

export const progressTitle = "Professional Progress";

export const progress: ProgressEntry[] = [
  {
    period: "AUTUMN 2025 — INCOMING",
    title: "MSc Applied Data Science",
    detail: "Anglia Ruskin University (Cambridge, UK)",
    upcoming: true,
  },
  {
    period: "2023 — PRESENT",
    title: "Full-Stack Engineer",
    detail: "Bomahut Limited (Nairobi, Kenya)",
  },
  {
    period: "2021 — PRESENT",
    title: "Freelance Systems Builder",
    detail: "5+ Production Apps shipped globally",
  },
];
