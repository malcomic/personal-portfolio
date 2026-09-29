import { expect, test } from "@playwright/test";
import { logIn } from "./helpers";

test.describe("dashboard login", () => {
  test("redirects logged-out visitors to the login page and back after signing in", async ({ page }) => {
    await page.goto("/dashboard/messages");
    await expect(page).toHaveURL("/dashboard/login?next=%2Fdashboard%2Fmessages");

    await logIn(page, "definitely-not-the-password");
    await expect(page.locator("#login-error")).toHaveText("Incorrect email or password.");
    await expect(page).toHaveURL(/\/dashboard\/login/);

    await logIn(page);
    await expect(page).toHaveURL("/dashboard/messages");
    await expect(page.getByRole("heading", { level: 1, name: "Messages" })).toBeVisible();

    await page.goto("/dashboard/login");
    await expect(page).toHaveURL("/dashboard");

    await page.goto("/dashboard/does-not-exist");
    await expect(page.getByRole("heading", { level: 1, name: "Not found" })).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL("/dashboard/login");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard\/login\?next=%2Fdashboard$/);
  });

  test("ignores off-site redirect targets", async ({ page }) => {
    await page.goto("/dashboard/login?next=https%3A%2F%2Fevil.example%2F");
    await logIn(page);
    await expect(page).toHaveURL("/dashboard");
  });
});
