import { expect, type Page } from "@playwright/test";
import { e2e } from "./env";

export async function logIn(page: Page, password = e2e.adminPassword) {
  await page.getByLabel("EMAIL").fill(e2e.adminEmail);
  await page.getByLabel("PASSWORD").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export async function logInAt(page: Page, path: string) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/dashboard\/login/);
  await logIn(page);
  await expect(page).toHaveURL(path);
}
