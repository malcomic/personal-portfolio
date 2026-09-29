import "server-only";
import { Resend } from "resend";
import { getEnv } from "@/lib/env";
import type { Message } from "@/lib/generated/prisma/client";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendContactAlert(message: Message) {
  const sender = message.name ?? message.email;
  const rows: [string, string][] = [
    ["Name", message.name ?? "Not provided"],
    ["Email", message.email],
    ["Project type", message.projectType ?? "Not specified"],
    ["Received", message.createdAt.toISOString()],
  ];

  const text = [...rows.map(([label, value]) => `${label}: ${value}`), "", message.details].join("\n");
  const html = `
    <table cellpadding="4" style="font-family:sans-serif;font-size:14px">
      ${rows.map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${escapeHtml(value)}</td></tr>`).join("")}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(message.details)}</p>
  `;

  try {
    const env = getEnv();
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: message.email,
      subject: `New enquiry: ${message.projectType ?? "General"} from ${sender}`,
      text,
      html,
    });
    if (error) console.error("Contact alert email failed", { messageId: message.id, error });
  } catch (error) {
    console.error("Contact alert email failed", { messageId: message.id, error });
  }
}
