export type SkillGroup = {
  title: string;
  icon: "server" | "layout" | "terminal" | "cpu";
  items: string[];
};

export const skillsIntro = {
  label: "02 / Capabilities",
  title: "Engineered Architecture",
  description:
    "A production-proven technology stack selected for fast execution, database integrity, and excellent UI performance.",
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend",
    icon: "server",
    items: ["Node.js & Express", "TypeScript", "Prisma ORM", "PostgreSQL", "REST APIs", "M-Pesa, Stripe & Paystack"],
  },
  {
    title: "Frontend",
    icon: "layout",
    items: ["React & Next.js", "Vite", "Tailwind CSS", "SASS / Less", "State Management", "Client Optimization"],
  },
  {
    title: "DevOps & Infra",
    icon: "terminal",
    items: [
      "Heroku Deployments",
      "Vercel Optimization",
      "Neon Serverless",
      "Docker Basics",
      "CI/CD Automations",
      "Linux Administration",
    ],
  },
  {
    title: "Integrations",
    icon: "cpu",
    items: [
      "LLM Fallback Chains",
      "Gemini & Groq APIs",
      "OpenRouter Integrations",
      "Progressive Web Apps",
      "Webhook Architecture",
      "Payment Gateways",
    ],
  },
];
