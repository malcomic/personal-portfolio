export type Role = {
  company: string;
  period: string;
  title: string;
  summary: string;
  current?: boolean;
};

export const experienceIntro = {
  label: "04 / Archive",
  title: "Professional History",
};

export const roles: Role[] = [
  {
    company: "Bomahut Limited",
    period: "2023 — PRESENT",
    title: "FULL-STACK SOFTWARE ENGINEER",
    summary:
      "Leading feature architectures across a core residential billing engine. Optimized payment flows, resolved high-concurrency billing tasks, and optimized client dashboard modules.",
    current: true,
  },
  {
    company: "Independent Engineering",
    period: "2021 — PRESENT",
    title: "FREELANCE FULL-STACK DEVELOPER",
    summary:
      "Delivered 5+ web applications. Formulated bespoke systems from payments (M-Pesa STK push) to NCLEX test preparation platforms globally.",
  },
];

export const educationIntro = {
  label: "05 / Academia",
  title: "Scientific Path",
};

export const education = {
  status: "INCOMING — AUTUMN 2025",
  degree: "MSc Applied Data Science",
  school: "Anglia Ruskin University",
  location: "Cambridge, UK",
  focus:
    "Focusing on predictive SaaS analytics, automated agricultural resource logic, and serverless data scaling mechanisms.",
};
