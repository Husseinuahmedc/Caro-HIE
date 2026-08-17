import { expect, test } from "@playwright/test";

test("creates, edits, autosaves, and reopens a local project", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /صمّم فكرتك/ })).toBeVisible();
  await page.getByRole("button", { name: "إنشاء وفتح المحرر" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
  await expect(page.getByText("كاروسيل عربي جديد", { exact: true })).toBeVisible();

  const layerCount = await page.locator("[data-hit-layer]").count();
  await page.getByRole("button", { name: "إضافة نص" }).click();
  await expect(page.locator("[data-hit-layer]")).toHaveCount(layerCount + 1);
  await expect(page.getByText("محفوظ محلياً")).toBeVisible({ timeout: 5_000 });

  await page.reload();
  await expect(page.getByRole("heading", { name: "مشاريعك" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "كاروسيل عربي جديد" })).toBeVisible();
  await page.getByRole("button", { name: "فتح المشروع" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog], .vite-error-overlay")).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});

test("keeps slide controls accessible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "إنشاء وفتح المحرر" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "الشريحة الحالية" })).toBeVisible();
  const initialOptions = await page.getByRole("combobox", { name: "الشريحة الحالية" }).locator("option").count();
  await page.getByRole("button", { name: "إضافة شريحة" }).click();
  await expect(page.getByRole("combobox", { name: "الشريحة الحالية" }).locator("option")).toHaveCount(initialOptions + 1);
});

test("exports canonical JSON, SVG, PNG, and PDF files", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "إنشاء وفتح المحرر" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
  for (const format of ["JSON", "SVG", "PNG", "PDF"] as const) {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: `تصدير ${format}` }).click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    let size = 0;
    for await (const chunk of stream) size += chunk.length;
    expect(size, `${format} export should not be empty`).toBeGreaterThan(200);
  }
});
