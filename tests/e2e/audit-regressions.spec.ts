import { expect, test, type Page } from "@playwright/test";

async function createProject(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await expect(page.getByRole("dialog", { name: "محتوى السلسلة" })).toBeVisible();
  await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
}

test.describe("Studio Audit Regressions", () => {
  test("1. negative numeric input in properties shows inline error and does not break autosave", async ({ page }) => {
    await createProject(page);

    // Add a shape
    await page.getByRole("button", { name: "إضافة شكل", exact: true }).click();
    await expect(page.locator("[data-canvas-frame] [data-layer-type='shape']").first()).toBeVisible();

    // Select the shape
    const shape = page.locator("[data-canvas-frame] [data-layer-type='shape']").first();
    const id = await shape.getAttribute("data-layer-id");
    await page.locator(`[data-hit-layer="${id}"]`).click();

    // In properties panel (desktop), find the width field
    const widthInput = page.getByLabel("العرض", { exact: true });
    await expect(widthInput).toBeVisible();

    // Type invalid negative width -20
    await widthInput.fill("-20");
    await expect(page.getByText("الحد الأدنى 1")).toBeVisible();

    // Blur the field: invalid value should revert, document state intact
    await widthInput.blur();
    await expect(page.locator("body")).not.toContainText("تعذر الوصول إلى التخزين المحلي.");
    await expect(page.locator("body")).not.toContainText("تعذر الحفظ");

    // Type valid width 350 and blur
    await widthInput.fill("350");
    await widthInput.blur();
    await expect(page.getByText("الحد الأدنى 1")).not.toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "محفوظ في هذا المتصفح" })).toBeVisible();
  });

  test("2. inline text editing reflects pending save and persists via Ctrl+S", async ({ page }) => {
    await createProject(page);

    const titleLayer = page.locator("[data-canvas-frame] [data-layer-type='text']").first();
    const id = await titleLayer.getAttribute("data-layer-id");
    await page.locator(`[data-hit-layer="${id}"]`).dblclick();

    const inlineEditor = page.getByRole("textbox", { name: "تحرير النص مباشرة" });
    await expect(inlineEditor).toBeVisible();

    // Type text inside inline editor
    await inlineEditor.fill("نص جديد قيد التحرير");

    // Inspect save status while still focused: must NOT falsely claim "محفوظ في هذا المتصفح"
    await expect(page.getByRole("status").filter({ hasText: "بانتظار الحفظ…" })).toBeVisible();

    // Press Control+S to commit and trigger save
    await inlineEditor.press("Control+s");
    await expect(page.getByRole("status").filter({ hasText: "محفوظ في هذا المتصفح" })).toBeVisible();
    await expect(titleLayer).toHaveText("نص جديد قيد التحرير");
  });

  test("3. arrow keys do not nudge canvas selection when modal dialog is open", async ({ page }) => {
    await createProject(page);

    // Add a shape
    await page.getByRole("button", { name: "إضافة شكل", exact: true }).click();
    const shape = page.locator("[data-canvas-frame] [data-layer-type='shape']").first();
    const id = await shape.getAttribute("data-layer-id");
    await page.locator(`[data-hit-layer="${id}"]`).click();

    // Open "الموقع والتسمية · متقدم" to read initial X
    await page.getByText("الموقع والتسمية · متقدم").click();
    const xInput = page.getByLabel("X", { exact: true });
    const initialX = await xInput.inputValue();

    // Open Preflight modal
    await page.getByRole("button", { name: "الفحص", exact: true }).click();
    const preflightDialog = page.getByRole("dialog", { name: "فحص قبل النشر" });
    await expect(preflightDialog).toBeVisible();

    // Press ArrowRight while inside the dialog
    const closeBtn = preflightDialog.getByRole("button", { name: "إغلاق", exact: true });
    await closeBtn.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    // Close the dialog
    await closeBtn.click();
    await expect(preflightDialog).not.toBeVisible();

    // Re-verify X input has NOT changed
    await expect(xInput).toHaveValue(initialX);
  });

  test("4. rotated shape preflight detects boundary overflow", async ({ page }) => {
    await createProject(page);

    // Add a shape
    await page.getByRole("button", { name: "إضافة شكل", exact: true }).click();
    const shape = page.locator("[data-canvas-frame] [data-layer-type='shape']").first();
    const id = await shape.getAttribute("data-layer-id");
    await page.locator(`[data-hit-layer="${id}"]`).click();

    // Set dimensions: width=840, height=480, rotation=45
    const widthInput = page.getByLabel("العرض", { exact: true });
    await widthInput.fill("840");
    await widthInput.blur();

    const heightInput = page.getByLabel("الارتفاع", { exact: true });
    await heightInput.fill("480");
    await heightInput.blur();

    const rotInput = page.getByLabel("الدوران", { exact: true });
    await rotInput.fill("45");
    await rotInput.blur();

    // Open "الموقع والتسمية · متقدم" to set X=120, Y=120
    await page.getByText("الموقع والتسمية · متقدم").click();
    const xInput = page.getByLabel("X", { exact: true });
    await xInput.fill("120");
    await xInput.blur();

    const yInput = page.getByLabel("Y", { exact: true });
    await yInput.fill("120");
    await yInput.blur();

    // Open preflight dialog
    await page.getByRole("button", { name: "الفحص", exact: true }).click();
    const preflightDialog = page.getByRole("dialog", { name: "فحص قبل النشر" });
    await expect(preflightDialog).toBeVisible();

    // Verify overflow issue is reported
    await expect(preflightDialog.getByText("العنصر يتجاوز حدود الشريحة.")).toBeVisible();
  });

  test("5. blank project starts directly in editor with 1 empty slide", async ({ page }) => {
    await page.goto("/");

    // Click "تصميم فارغ" template button
    const blankCard = page.getByRole("button", { name: /تصميم فارغ/ });
    await expect(blankCard).toBeVisible();
    await blankCard.click();

    // Click create project
    await page.getByRole("button", { name: "إنشاء وبدء التصميم" }).click();

    // Must enter editor directly without opening "محتوى السلسلة" dialog
    await expect(page.getByRole("dialog", { name: "محتوى السلسلة" })).not.toBeVisible();
    await expect(page.locator("[data-canvas-frame]")).toBeVisible();

    // Verify slide is empty (0 layers on canvas frame)
    await expect(page.locator("[data-canvas-frame] [data-layer-id]")).toHaveCount(0);
  });

  test("6. topbar backup download is readily accessible", async ({ page }) => {
    await createProject(page);

    const backupBtn = page.getByRole("button", { name: "نسخة احتياطية", exact: true });
    await expect(backupBtn).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await backupBtn.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });
});
