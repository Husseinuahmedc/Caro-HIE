import { expect, test } from "@playwright/test";

test("dashboard visual baseline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /الفكرة أولاً/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("dashboard.png", { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.015 });
});

test("editor visual baseline", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("editor.png", { animations: "disabled", maxDiffPixelRatio: 0.015 });
});

test("mobile dashboard visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /الفكرة أولاً/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("dashboard-mobile.png", { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.015 });
});

test("mobile editor visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("editor-mobile.png", { animations: "disabled", maxDiffPixelRatio: 0.015 });
});
