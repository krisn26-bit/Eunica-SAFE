import { expect, test } from "@playwright/test";

test.describe("safety plan and privacy controls", () => {
  test("saved numbers appear where they are needed", async ({ page }) => {
    await page.goto("/safety-plan");

    await page
      .getByLabel(/hospital or birth center/i)
      .fill("Example General Hospital");
    await page
      .getByLabel(/^phone/i)
      .first()
      .fill("215 555 0199");
    await page
      .getByLabel(/name of your ob\/gyn or midwife/i)
      .fill("Dr. Example");
    await page.getByRole("button", { name: /save my safety plan/i }).click();

    await expect(page.getByText(/^saved /i).first()).toBeVisible();

    await page.goto("/emergency");
    await expect(page.getByText("Example General Hospital")).toBeVisible();
    await expect(page.getByText("Dr. Example")).toBeVisible();
  });

  test("data can be deleted from the device", async ({ page }) => {
    await page.goto("/safety-plan");
    await page
      .getByLabel(/hospital or birth center/i)
      .fill("Example General Hospital");
    await page.getByRole("button", { name: /save my safety plan/i }).click();

    await page.goto("/privacy");
    await page.getByRole("button", { name: /delete all my data/i }).click();
    await page
      .getByRole("button", { name: /yes, delete all my data/i })
      .click();

    await expect(
      page.getByText(/has been deleted from this browser/i),
    ).toBeVisible();

    await page.goto("/safety-plan");
    await expect(page.getByLabel(/hospital or birth center/i)).toHaveValue("");
  });

  test("the plan survives a reload on the same device", async ({ page }) => {
    await page.goto("/safety-plan");
    await page.getByLabel(/emergency contact name/i).fill("Sam Example");
    await page.getByRole("button", { name: /save my safety plan/i }).click();
    await page.reload();
    await expect(page.getByLabel(/emergency contact name/i)).toHaveValue(
      "Sam Example",
    );
  });
});
