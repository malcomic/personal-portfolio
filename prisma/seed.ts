import { loadEnvConfig } from "@next/env";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../lib/generated/prisma/client";
import type { MessageStatus } from "../lib/generated/prisma/enums";
import { projectTypes } from "../lib/data/contact";
import { projects } from "./data/projects";
import { formatSeedErrors, seedProjectRow } from "./data/toRow";

loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

const senders = [
  { name: "Amina Wanjiku", email: "amina@shambatech.co.ke" },
  { name: "David Otieno", email: "d.otieno@example.com" },
  { name: null, email: "procurement@acme-logistics.com" },
  { name: "Grace Mutua", email: "grace.mutua@example.org" },
  { name: "Brian Kiprop", email: "brian@kiprop.dev" },
  { name: null, email: "hello@nairobi-eats.co.ke" },
  { name: "Sarah Njeri", email: "sarah@njeri-clinic.com" },
];

const details = [
  "We run three dairy cooperatives and need a simple app for farmers to log daily milk deliveries. Budget is flexible for the right MVP. Timeline: 8 weeks.",
  "Looking for help integrating M-Pesa STK Push into our existing Django checkout. Payments sometimes fail silently and we need proper callback handling.",
  "Could you build an admin dashboard for our logistics fleet? We track about 40 trucks and currently use spreadsheets.\n\nIdeally live by end of quarter.",
  "Our marketing site is slow and hard to update. We'd like a rebuild with a CMS our team can use without a developer.",
  "Need an API for a mobile app: auth, bookings and push notifications. The frontend team is already in place.",
  "Quick question: do you take on maintenance retainers for existing Node.js projects?",
  "We want to add Paystack alongside Stripe for customers in Nigeria and Ghana. Can you estimate the effort?",
];

const statuses: MessageStatus[] = ["NEW", "NEW", "REPLIED", "REPLIED", "ARCHIVED"];

async function seedProjects() {
  const rows = projects.map(seedProjectRow);
  const invalid = formatSeedErrors(rows);
  if (invalid) throw new Error(`Invalid entries in prisma/data/projects.ts:\n${invalid}`);

  let inserted = 0;
  for (const [index, row] of rows.entries()) {
    if (!row.ok) continue;
    const exists = await db.project.findUnique({ where: { slug: row.slug }, select: { id: true } });
    await db.project.upsert({
      where: { slug: row.slug },
      update: {},
      create: { ...row.data, sortOrder: index },
    });
    if (!exists) inserted += 1;
  }
  console.log(`Projects: inserted ${inserted}, already present ${projects.length - inserted}.`);
}

async function seedMessages() {
  if (process.env.NODE_ENV === "production") {
    console.log("NODE_ENV=production; skipping sample messages.");
    return;
  }

  const existing = await db.message.count();
  if (existing > 0) {
    console.log(`Message table already has ${existing} rows; skipping sample messages.`);
    return;
  }

  const now = Date.now();
  const data = Array.from({ length: 25 }, (_, index) => {
    const sender = senders[index % senders.length];
    const status = statuses[index % statuses.length];
    const createdAt = new Date(now - index * 29 * 60 * 60 * 1000);
    return {
      name: sender.name,
      email: sender.email,
      projectType: index % 4 === 3 ? null : projectTypes[index % projectTypes.length],
      details: details[index % details.length],
      status,
      createdAt,
      repliedAt:
        status === "NEW" || (status === "ARCHIVED" && index % 2 === 1)
          ? null
          : new Date(createdAt.getTime() + 3 * 60 * 60 * 1000),
    };
  });

  await db.message.createMany({ data });
  console.log(`Inserted ${data.length} sample messages.`);
}

async function main() {
  await seedProjects();
  await seedMessages();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
