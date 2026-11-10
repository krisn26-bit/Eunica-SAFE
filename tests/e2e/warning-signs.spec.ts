import { expect, test } from "@playwright/test";

test.describe("warning sign library", () => {
  test("search narrows the index without leaving the page", async ({
    page,
  }) => {
    await page.goto("/warning-signs");

    await page.getByLabel(/search warning signs/i).fill("headache");
    await expect(
      page.getByRole("link", { name: /severe headache/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /breast infection/i }),
    ).toHaveCount(0);
    expect(page.url()).not.toContain("headache");
  });

  test("an article says what to do and when to call 911", async ({ page }) => {
    await page.goto("/warning-signs");
    await page
      .getByRole("link", { name: /heavy bleeding/i })
      .first()
      .click();

    await expect(
      page.getByRole("heading", { name: /heavy bleeding/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/what it looks like/i)).toBeVisible();
    await expect(page.getByText(/^call 911 if/i).first()).toBeVisible();
    await expect(page.getByText(/draft content/i).first()).toBeVisible();
  });

  test("categories filter the index", async ({ page }) => {
    await page.goto("/warning-signs");
    await page.getByRole("button", { name: /^mental health$/i }).click();
    await expect(
      page.getByRole("link", { name: /thoughts of self-harm/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /heavy bleeding/i }),
    ).toHaveCount(0);
  });

  test("the recovery tracker prompts on a published threshold", async ({
    page,
  }) => {
    await page.goto("/recovery");
    await page.getByLabel(/^temperature/i).fill("101.2");
    await expect(page.getByText(/100\.4/).first()).toBeVisible();
    await expect(
      page
        .getByRole("button", { name: /answer questions about this/i })
        .first(),
    ).toBeVisible();
  });
});
