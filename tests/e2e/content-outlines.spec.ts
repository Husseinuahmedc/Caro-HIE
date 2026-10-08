import { expect, test } from "@playwright/test";

const outlines = [
  { id: "tech-explainer", title: "أخطاء شائعة في JavaScript", count: 6, second: "المشكلة", body: "الخطأ مو دائماً من الكود نفسه" },
  { id: "question-answer", title: "سؤال يستحق جواباً", count: 6, second: "الجواب المختصر", body: "الجواب: نعم، ولكن…" },
  { id: "practical-steps", title: "من الفكرة إلى التطبيق", count: 7, second: "الخطوة الأولى", body: "1. ابدأ من الأساس" },
  { id: "before-after", title: "شنو تغيّر؟", count: 6, second: "قبل", body: "قبل التغيير" },
  { id: "code-walkthrough", title: "من السطر إلى المعنى", count: 7, second: "السياق", body: "السياق أولاً" },
];
for (const outline of outlines) {
  test(`${outline.id}: setup preview, writing, canvas, save and reload`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("button", { name: "اختيار تحرير جريء", exact: true }).click();
    await page.getByLabel("بنية المحتوى", { exact: true }).selectOption(outline.id);
    await expect(page.getByLabel("عدد الشرائح", { exact: true })).toHaveValue(String(outline.count));
    await expect(page.locator("aside")).toContainText(outline.title);
    await expect(page.locator("aside")).toContainText(`01 / ${outline.count}`);
    await page.getByRole("button", { name: "إنشاء وكتابة المحتوى", exact: true }).click();
    const nav = page.getByRole("navigation", { name: "محتوى الشرائح" });
    await expect(nav.getByRole("button")).toHaveCount(outline.count + 1);
    await nav.getByRole("button", { name: `2 ${outline.second}`, exact: true }).click();
    await expect(page.getByRole("textbox", { name: "العنوان", exact: true })).toHaveValue(outline.body);
    const edit = `محتوى محفوظ ${outline.id}`;
    await page.getByRole("textbox", { name: "العنوان", exact: true }).fill(edit);
    await expect(page.locator("main aside")).toContainText(edit);
    await page.getByRole("button", { name: "متابعة إلى التصميم", exact: true }).click();
    await expect(page.locator("[data-canvas-frame]")).toContainText(edit);
    await expect(page.getByRole("status").filter({ hasText: "محفوظ في هذا المتصفح" })).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "فتح المشروع", exact: true }).first().click();
    await page.getByRole("button", { name: "المحتوى", exact: true }).click();
    await page.getByRole("navigation", { name: "محتوى الشرائح" }).getByRole("button", { name: `2 ${outline.second}`, exact: true }).click();
    await expect(page.getByRole("textbox", { name: "العنوان", exact: true })).toHaveValue(edit);
    expect(errors).toEqual([]);
  });
}
for (const mobile of [false, true]) {
  test(`${mobile ? "mobile" : "desktop"}: blank, user count and invalid custom dimensions`, async ({ page }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.getByRole("button", { name: "اختيار تحرير جريء", exact: true }).click();
    await page.getByLabel("عدد الشرائح", { exact: true }).fill("24");
    await page.getByLabel("بنية المحتوى", { exact: true }).selectOption("practical-steps");
    await expect(page.getByLabel("عدد الشرائح", { exact: true })).toHaveValue("24");
    await expect(page.locator("aside")).toContainText("01 / 24");
    await page.getByRole("button", { name: "مقاس مخصص", exact: true }).click();
    await page.getByLabel("العرض بالبكسل").fill("720.5");
    await expect(page.locator("aside [aria-label]").first()).toHaveCSS("aspect-ratio", "721 / 1350");
    await page.getByLabel("العرض بالبكسل").fill("");
    await expect(page.locator("aside [aria-label]").first()).toHaveCSS("aspect-ratio", "64 / 1350");
    await page.getByRole("button", { name: "مربع 1:1", exact: true }).click();
    await page.getByLabel("بنية المحتوى", { exact: true }).selectOption("blank");
    await expect(page.locator("aside [data-layer-type]")).toHaveCount(0);
    await page.getByRole("button", { name: "إنشاء وبدء التصميم", exact: true }).click();
    await expect(page.locator("[data-canvas-frame]")).toBeVisible();
    if (mobile) {
      await page.getByRole("button", { name: "الشرائح والطبقات", exact: true }).click();
      const navigation = page.getByRole("dialog", { name: "الشرائح والطبقات" });
      await expect(navigation.getByRole("button", { name: /سحب الشريحة/ })).toHaveCount(24);
      await navigation.getByRole("button", { name: "إغلاق", exact: true }).click();
    } else {
      await expect(page.getByRole("button", { name: /سحب الشريحة/ })).toHaveCount(24);
    }
    await expect(page.locator("[data-canvas-frame] [data-layer-type]")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
