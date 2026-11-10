import { expect, test } from "@playwright/test";

const PAGES = [
  "/",
  "/dashboard",
  "/warning-signs",
  "/warning-signs/heavy-bleeding",
  "/seek-care",
  "/care-locator",
  "/safety-plan",
  "/recovery",
  "/resources",
  "/emergency",
  "/about",
  "/privacy",
];

test.describe("emergency access", () => {
  for (const path of PAGES) {
    test(`911 is one tap from ${path}`, async ({ page }) => {
      await page.goto(path);
      const call911 = page.getByRole("link", { name: /call 911/i }).first();
      await expect(call911).toBeVisible();
      await expect(call911).toHaveAttribute("href", "tel:911");
    });
  }

  test("the emergency page is reachable in one tap from the bar", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /emergency help/i })
      .first()
      .click();
    await expect(
      page.getByRole("heading", { name: /get help now/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /call 988/i }).first(),
    ).toHaveAttribute("href", "tel:988");
  });

  test("a missing page still offers emergency help", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("link", { name: /call 911/i }).first(),
    ).toBeVisible();
  });

  test("the skip link reaches the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: /skip to main content/i }),
    ).toBeFocused();
  });
});
