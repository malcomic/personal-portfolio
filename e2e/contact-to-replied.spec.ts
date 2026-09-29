import { expect, test } from "@playwright/test";
import { TEST_EMAIL_DOMAIN } from "./env";
import { logInAt } from "./helpers";

test("a contact submission shows up in the dashboard and can be marked as replied", async ({ page }) => {
  const stamp = Date.now();
  const name = `E2E Tester ${stamp}`;
  const email = `e2e-${stamp}@${TEST_EMAIL_DOMAIN}`;

  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Project inquiry" });
  await form.getByLabel("YOUR NAME").fill(name);
  await form.getByLabel("EMAIL ADDRESS").fill(email);
  await form.getByLabel("PROJECT DETAILS & TIMELINE").fill("End-to-end test message. Please ignore, it is deleted automatically.");
  await form.getByRole("button", { name: "Send Inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Message received." })).toBeVisible();

  const search = `/dashboard/messages?q=${encodeURIComponent(email)}`;
  await logInAt(page, search);
  const table = page.getByRole("table");
  await expect(table.getByText(email)).toBeVisible();
  await table.getByRole("link", { name }).click();

  await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
  await expect(page.getByText("New", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark as Replied" }).click();
  await expect(page.getByText("Marked as replied")).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark as New" })).toBeVisible();
  await expect(page.getByText("Replied", { exact: true })).toBeVisible();
  await expect(page.getByText("REPLIED", { exact: true })).toBeVisible();

  await page.goto(`/dashboard/messages?status=REPLIED&q=${encodeURIComponent(email)}`);
  await expect(page.getByRole("table").getByRole("link", { name })).toBeVisible();
  await page.goto(`/dashboard/messages?status=NEW&q=${encodeURIComponent(email)}`);
  await expect(page.getByText("No messages match your search.")).toBeVisible();
});
