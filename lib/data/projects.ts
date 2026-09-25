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

export const projects: Project[] = [
  {
    slug: "zizi",
    title: "Zizi",
    subtitle: "Dairy Farm Management SaaS",
    status: "LIVE MVP",
    featured: true,
    description:
      "Designed and built to optimize dairy operations. Features automated herd metrics, lactation mapping, and yield logs. Live system currently powering active commercial farms.",
    listDescription:
      "Designed and built to optimize dairy operations. Features automated herd metrics, lactation mapping, and yield logs. Currently powering active commercial farms.",
    listScreenshot: { caption: "dairy farm SaaS dashboard user interface, dark mode terminal aesthetic" },
    features: [
      "Complete yield analytics mapping herd outputs over time",
      "Multi-user roles ensuring laborers and farm owners sync logs",
      "Low-latency offline capability optimized for rural network drops",
    ],
    tags: ["Node.js", "Express", "Prisma ORM", "PostgreSQL", "React"],
    caseStudy: {
      draft: false,
      headline: "Zizi SaaS",
      tagline: "Dairy Farm Management Platform optimized for low-network field sync.",
      facts: {
        client: "Zizi Agritech Inc.",
        role: "Sole Founder & Architect",
        technologies: "React, Prisma, PostgreSQL",
        delivery: "September 2024 (Active)",
      },
      hero: {
        caption:
          "high fidelity full dashboard of Zizi analytics showing milk yield, livestock medical logs, and client billing portal",
      },
      problem:
        "Commercial dairy farming in East Africa has historically run on loose ledger paper and scattered Excel spreadsheets. Because rural network infrastructures suffer regular drops, real-time sync with cloud systems failed consistently. Farm managers could not safely audit yield variables, track veterinary logs, or track lactation metrics accurately.",
      built:
        "I designed and built Zizi—a resilient, low-overhead farm management portal. The core system processes automated daily yield diagnostics, generates real-time charts mapping herd performance against target baselines, and syncs asynchronously. The backend uses Prisma ORM on a Neon serverless PostgreSQL instance to scale database queries affordably.",
      gallery: [
        { caption: "yield prediction charts and livestock metrics interface" },
        { caption: "offline synchronization log interface with database queue sync" },
      ],
      architecture: [
        {
          title: "React & Tailwind CSS Frontend",
          body: "Highly performant, lightweight client design guaranteeing near-instant rendering on mid-range tablets used in fields.",
        },
        {
          title: "Node.js & Prisma Backend",
          body: "TypeScript routes connecting complex multi-user parameters with high speed database performance and transactional integrity.",
        },
      ],
      challenges: [
        {
          title: "Intermittent Sync Logic",
          body: "Constructed a local storage queue that catches manual logs during disconnects and syncs batch transactions securely.",
        },
        {
          title: "Multi-tenant Isolation",
          body: "Strict schema-level segregation preventing data leakage between multi-family commercial farm units.",
        },
      ],
    },
  },
  {
    slug: "coachmauriceke",
    title: "CoachMauriceKE",
    subtitle: "AI-Generated Meal Plans V2",
    status: "PRODUCTION",
    featured: true,
    description:
      "Fitness coaching and client portal built as a high-conversion Progressive Web App. Includes automatic nutritional matrix generation.",
    listDescription:
      "Fitness coaching and client portal built as a high-conversion Progressive Web App. Includes automatic nutritional matrix generation and offline capability.",
    listScreenshot: { caption: "fitness program and nutritional client portal matrix layout UI" },
    features: [
      "LLM Fallback (Gemini + Groq) to ensure uninterrupted generation",
      "Custom PWA layout bypassing high app store cuts",
    ],
    tags: ["Gemini API", "Groq", "Vite", "PWA", "Tailwind"],
    caseStudy: {
      draft: true,
      headline: "CoachMauriceKE",
      tagline: "AI-assisted fitness coaching portal delivered as an installable Progressive Web App.",
      facts: {
        client: "CoachMauriceKE",
        role: "Full-Stack Developer",
        technologies: "Vite, Tailwind, Gemini, Groq",
        delivery: "In Production",
      },
      hero: { caption: "client dashboard with weekly training programme and generated meal plan" },
      problem:
        "Personalised meal plans were written by hand for every client, which capped how many people the coach could serve. Publishing a native app would have meant high app store fees and a slow release cycle, and a single AI provider made plan generation fragile whenever that provider was slow or down.",
      built:
        "I built a client portal as a Progressive Web App that installs straight from the browser. Clients enter their goals and preferences, and the system generates a nutritional matrix and meal plan automatically. Generation runs through an LLM fallback chain, so a failed request to one provider is retried on the next without the client noticing.",
      gallery: [
        { caption: "generated nutritional matrix and macro breakdown view" },
        { caption: "installable PWA home screen and offline programme view" },
      ],
      architecture: [
        {
          title: "Vite & Tailwind PWA Frontend",
          body: "Lightweight installable client with offline caching, so programmes stay available on weak mobile connections.",
        },
        {
          title: "LLM Fallback Chain",
          body: "Gemini as the primary model with Groq as a fallback, behind one interface that validates every generated plan.",
        },
      ],
      challenges: [
        {
          title: "Uninterrupted Generation",
          body: "Detected provider timeouts and malformed responses early and retried on the fallback model, keeping plan generation reliable.",
        },
        {
          title: "App Store Independence",
          body: "Delivered a native-feeling install and offline experience without app store distribution or its revenue cut.",
        },
      ],
    },
  },
  {
    slug: "trfc-ticketing",
    title: "TRFC Ticketing",
    subtitle: "Event Ticketing & Verification",
    status: "DEPLOYED",
    featured: true,
    description:
      "A high-security, high-availability ticketing engine featuring instant QR authentication at gate structures.",
    listDescription:
      "A high-security, high-availability ticketing engine featuring instant QR authentication at gate structures with M-Pesa automated deliveries.",
    listScreenshot: { caption: "event secure QR code ticket receipt scanner UI" },
    features: [
      "M-Pesa STK Push automated instant ticket delivery",
      "Secure QR verification code generator with anti-replay logs",
    ],
    tags: ["M-Pesa API", "Paystack", "CORS Dual-Domain", "QR Engine"],
    caseStudy: {
      draft: true,
      headline: "TRFC Ticketing",
      tagline: "Mobile-money ticketing with instant QR verification at the gate.",
      facts: {
        client: "TRFC",
        role: "Full-Stack Developer",
        technologies: "M-Pesa API, Paystack, QR Engine",
        delivery: "Deployed",
      },
      hero: { caption: "ticket purchase flow, QR ticket receipt and gate scanner dashboard" },
      problem:
        "Event tickets were sold and checked by hand, which led to long gate queues, cash handling risk and duplicated or forged tickets. Fans needed to pay with mobile money and receive a ticket instantly, and gate staff needed a fast way to confirm each ticket was genuine and unused.",
      built:
        "I built a ticketing engine where buyers pay through an M-Pesa STK Push prompt or Paystack and receive a unique QR ticket as soon as the payment is confirmed. At the gate, staff scan tickets against a verification service that accepts each code once and logs every scan attempt.",
      gallery: [
        { caption: "M-Pesa STK Push checkout and instant ticket delivery screen" },
        { caption: "gate verification scanner with anti-replay scan log" },
      ],
      architecture: [
        {
          title: "Payment-Driven Ticket Issuance",
          body: "Payment callbacks from M-Pesa and Paystack trigger ticket creation, so a ticket only exists once money has been received.",
        },
        {
          title: "Dual-Domain API",
          body: "A CORS configuration serving the public sales site and the gate verification app from separate domains.",
        },
      ],
      challenges: [
        {
          title: "Anti-Replay Verification",
          body: "Signed, single-use QR codes with scan logs, so a screenshot or copied ticket cannot get a second person through the gate.",
        },
        {
          title: "Reliable Payment Callbacks",
          body: "Idempotent callback handling so repeated or delayed payment notifications never issue duplicate tickets.",
        },
      ],
    },
  },
  {
    slug: "nursepath",
    title: "NursePath",
    subtitle: "NCLEX-RN Prep Platform",
    status: "LIVE PRODUCT",
    featured: true,
    description:
      "Digital product ecosystem assisting nursing students globally to pass standard NCLEX prep. Architected modular layout migrating to a performant Next.js core.",
    listDescription:
      "Digital product ecosystem assisting nursing students globally to pass standard NCLEX prep. Architected modular layout migrating to performant Next.js core.",
    listScreenshot: { caption: "educational test prep online testing modules, dark layout design" },
    features: [
      "Dynamic question logs evaluating preparation accuracy metrics",
      "Direct stripe processing mapped with micro-SEO optimized pages",
    ],
    tags: ["Next.js", "Stripe Checkout", "Vite Migration", "SEO Core"],
    caseStudy: {
      draft: true,
      headline: "NursePath",
      tagline: "NCLEX-RN preparation platform for nursing students worldwide.",
      facts: {
        client: "NursePath",
        role: "Full-Stack Developer",
        technologies: "Next.js, Stripe Checkout",
        delivery: "Live Product",
      },
      hero: { caption: "practice question module with accuracy metrics and progress dashboard" },
      problem:
        "Nursing students preparing for the NCLEX-RN needed focused practice with clear feedback on where they were weak. The original single-page build was hard to extend, slow to load and difficult for search engines to index, which limited organic sign-ups.",
      built:
        "I built a modular prep platform with practice question sets that log every answer and turn the results into accuracy metrics by topic. Payments run through Stripe Checkout, and the product is being migrated from its original Vite build to a Next.js core with SEO-optimised landing pages.",
      gallery: [
        { caption: "topic accuracy metrics and question history view" },
        { caption: "Stripe Checkout plan selection and SEO landing page" },
      ],
      architecture: [
        {
          title: "Next.js Core",
          body: "Server-rendered pages for fast first loads and search visibility, replacing the original client-only Vite build.",
        },
        {
          title: "Stripe Checkout",
          body: "Hosted checkout for secure payments, with access granted automatically once a payment succeeds.",
        },
      ],
      challenges: [
        {
          title: "Incremental Migration",
          body: "Moved features to Next.js module by module so the live product kept serving students throughout the migration.",
        },
        {
          title: "Meaningful Progress Metrics",
          body: "Turned raw answer logs into per-topic accuracy scores that show students exactly what to study next.",
        },
      ],
    },
  },
  {
    slug: "rono-digital",
    title: "Rono Digital",
    subtitle: "SME Web Development Service",
    status: "COMPLETED",
    featured: false,
    description:
      "Modular landing page system and micro-CMS developed to empower regional small-to-medium enterprises with robust local search rankings and high load speeds.",
    listDescription:
      "Modular landing page system and micro-CMS developed to empower regional small-to-medium enterprises with robust local search rankings and high load speeds.",
    listScreenshot: { caption: "minimal portfolio website showcase with grid layout" },
    features: [
      "Reusable landing page sections assembled per client",
      "Content editing through a headless CMS without developer help",
    ],
    tags: ["Next.js", "Tailwind CSS", "Directus CMS", "Vercel Edge"],
    caseStudy: {
      draft: true,
      headline: "Rono Digital",
      tagline: "Fast, search-friendly websites for regional small and medium businesses.",
      facts: {
        client: "Regional SMEs",
        role: "Founder & Lead Developer",
        technologies: "Next.js, Directus CMS, Vercel",
        delivery: "Completed",
      },
      hero: { caption: "client website showcase built from the modular landing page system" },
      problem:
        "Local businesses needed websites that loaded quickly on mobile data and ranked in local search, but custom builds were too expensive and generic site builders were slow and hard to optimise. Owners also wanted to update their own content without calling a developer.",
      built:
        "I built a modular landing page system in Next.js paired with Directus as a micro-CMS. Each client site is assembled from reusable, SEO-ready sections, deployed on Vercel's edge network, and editable by the business owner through a simple content dashboard.",
      gallery: [
        { caption: "modular section library used to assemble client pages" },
        { caption: "Directus content dashboard for business owners" },
      ],
      architecture: [
        {
          title: "Next.js & Tailwind CSS Sections",
          body: "A shared library of responsive, accessible sections that turns new client sites into configuration rather than new code.",
        },
        {
          title: "Directus Micro-CMS",
          body: "A headless CMS that lets each business edit its own text, images and opening hours safely.",
        },
      ],
      challenges: [
        {
          title: "Local Search Performance",
          body: "Structured data, fast static pages and per-location metadata to help small businesses rank in local search results.",
        },
        {
          title: "Low-Cost Delivery",
          body: "Reusable components and edge hosting kept build and running costs within small-business budgets.",
        },
      ],
    },
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  const count = projects.length;
  return {
    previous: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}
