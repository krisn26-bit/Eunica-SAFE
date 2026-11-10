import { expect, test } from "@playwright/test";

test.describe("should I seek care?", () => {
  test("a red flag short-circuits to 911", async ({ page }) => {
    await page.goto("/seek-care");

    await page
      .getByRole("radio", { name: /bleeding that worries me/i })
      .check();
    await page.getByRole("button", { name: /^continue$/i }).click();

    await page
      .getByRole("checkbox", { name: /chest pain, pressure, or tightness/i })
      .check();
    await page.getByRole("button", { name: /^continue$/i }).click();

    await expect(
      page.getByRole("heading", { name: /call 911 now/i }),
    ).toBeVisible();
    await expect(page.getByTestId("call-911").first()).toHaveAttribute(
      "href",
      "tel:911",
    );
  });

  test("never says the user is fine, and always offers escalation", async ({
    page,
  }) => {
    await page.goto("/seek-care");

    await page
      .getByRole("radio", { name: /something else — i do not see it listed/i })
      .check();
    await page.getByRole("button", { name: /^continue$/i }).click();

    await page
      .getByRole("checkbox", { name: /none of these are happening/i })
      .check();
    await page.getByRole("button", { name: /^continue$/i }).click();

    for (let step = 0; step < 8; step += 1) {
      const radios = page.getByRole("radio");
      const checkboxes = page.getByRole("checkbox");
      const hasRadios = (await radios.count()) > 0;
      const hasCheckboxes = (await checkboxes.count()) > 0;
      if (!hasRadios && !hasCheckboxes) break;
      await (hasRadios ? radios.first() : checkboxes.first()).check();
      await page.getByRole("button", { name: /^continue$/i }).click();
    }

    await expect(page.getByText(/why you are seeing this/i)).toBeVisible();
    await expect(page.getByText(/if anything changes/i)).toBeVisible();

    const result = page.getByRole("alert").first();
    await expect(result).toBeVisible();
    await expect(result.getByText(/you are fine/i)).toHaveCount(0);
    await expect(result.getByText(/nothing to worry about/i)).toHaveCount(0);
  });

  test("symptoms are never placed in the url", async ({ page }) => {
    await page.goto("/warning-signs/heavy-bleeding");
    await page
      .getByRole("button", { name: /i am experiencing this now/i })
      .click();

    await expect(page).toHaveURL(/\/seek-care$/);
    expect(page.url()).not.toContain("?");
    await expect(
      page.getByRole("group", { name: /is any of this happening right now/i }),
    ).toBeVisible();
  });

  test("the user can go back and change an answer", async ({ page }) => {
    await page.goto("/seek-care");
    await page
      .getByRole("radio", { name: /fever, chills, or signs of infection/i })
      .check();
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /^back$/i }).click();
    await expect(
      page.getByRole("radio", {
        name: /fever, chills, or signs of infection/i,
      }),
    ).toBeChecked();
  });
});
