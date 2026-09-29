import { expect, test, type Page } from "@playwright/test";

// Vercel serves the analytics scripts under /_vercel; a plain `next start` returns 404 for them.
const IGNORED = [/\/_vercel\//];

function watchProblems(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const url = message.location().url;
    if (IGNORED.some((pattern) => pattern.test(message.text()) || pattern.test(url))) return;
    problems.push(message.text());
  });
  page.on("pageerror", (error) => problems.push(`Uncaught: ${error.message}`));
  return problems;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(`CSP violation: ${event.violatedDirective} blocked ${event.blockedURI}`);
    });
  });
});

for (const path of ["/", "/about", "/projects", "/projects/zizi", "/contact", "/dashboard/login"]) {
  test(`${path} loads without errors or CSP violations`, async ({ page }) => {
    const problems = watchProblems(page);
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-security-policy"]).toContain("default-src 'self'");
    await expect(page.locator("h1").first()).toBeVisible();
    expect(problems).toEqual([]);
  });
}

test("unknown project slugs return the 404 page", async ({ page }) => {
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Route Not Found" })).toBeVisible();
});
