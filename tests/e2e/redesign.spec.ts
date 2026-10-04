import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const review = ".impeccable/review";
test("custom setup preview matches landscape geometry and comparison fields are independent", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "اختيار مقارنة واضحة", exact: true }).click();
  await page.getByRole("button", { name: "مقاس مخصص", exact: true }).click();
  await page.getByLabel("العرض بالبكسل").fill("1600");
  await page.getByLabel("الارتفاع بالبكسل").fill("900");
  const preview = page.locator("aside [aria-label]").first();
  await expect(preview).toHaveCSS("aspect-ratio", "1600 / 900");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await page.getByRole("textbox", { name: "نص قبل", exact: true }).fill("قبل التعديل");
  await page.getByRole("textbox", { name: "نص بعد", exact: true }).fill("بعد التعديل");
  await expect(page.getByRole("main")).toContainText("قبل التعديل");
  await expect(page.getByRole("main")).toContainText("بعد التعديل");
});
test("approved flow handles a 24-slide project and export ranges", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "اختيار ملاحظات مطور", exact: true })
    .click();
  await page.getByLabel("عدد الشرائح", { exact: true }).fill("24");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await expect(
    page.getByRole("heading", { name: "فكرة واحدة في كل سحبة." }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "العنوان", exact: true })
    .fill("الكود صح. ليش النتيجة غلط؟");
  await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
  await expect(page.getByRole("button", { name: /سحب الشريحة/ })).toHaveCount(
    24,
  );
  await page.getByRole("button", { name: "إضافة شريحة", exact: true }).click();
  await expect(page.getByRole("button", { name: /سحب الشريحة/ })).toHaveCount(
    25,
  );
  await page.getByRole("button", { name: "تراجع", exact: true }).click();
  await expect(page.getByRole("button", { name: /سحب الشريحة/ })).toHaveCount(
    24,
  );
  await page.getByRole("button", { name: "تصدير", exact: true }).click();
  await page.getByLabel("الشرائح", { exact: true }).selectOption("range");
  await page.getByLabel("نطاق الشرائح", { exact: true }).fill("1, 10, 24");
  await page.getByLabel("الصيغة", { exact: true }).selectOption("svg");
  const pending = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "تنزيل الملفات", exact: true })
    .click();
  expect((await pending).suggestedFilename()).toMatch(/svg.zip$/);
  await expect(
    page.getByRole("status").filter({ hasText: "الملف جاهز" }),
  ).toBeVisible();
});
for (const mobile of [false, true])
  test(`${mobile ? "mobile" : "desktop"} review captures`, async ({ page }) => {
    await mkdir(review, { recursive: true });
    await page.setViewportSize(
      mobile ? { width: 390, height: 844 } : { width: 1440, height: 1050 },
    );
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /الفكرة عندك/ }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${review}/${mobile ? "mobile" : "desktop"}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("navigation", {name:"التنقل الرئيسي"}).getByRole("button", { name: "القوالب", exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${review}/gallery-${mobile ? "mobile" : "desktop"}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page
      .getByRole("button", { name: "استخدام ملاحظات مطور", exact: true })
      .click();
    await page.getByLabel("عدد الشرائح", { exact: true }).fill("24");
    await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
    await expect(
      page.getByRole("heading", { name: "فكرة واحدة في كل سحبة." }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${review}/writer-${mobile ? "mobile" : "desktop"}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
    await expect(page.locator("[data-canvas-frame]")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${review}/editor-${mobile ? "mobile" : "desktop"}.png`,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "تصدير", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "تصدير السلسلة" }),
    ).toBeVisible();
    await page.screenshot({
      path: `${review}/export-${mobile ? "mobile" : "desktop"}.png`,
      fullPage: true,
      animations: "disabled",
    });
    expect(
      await page
        .locator("body")
        .evaluate((element) => element.scrollWidth > window.innerWidth),
    ).toBe(false);
  });

test("cancels a large PNG job without changing the project", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "اختيار ملاحظات مطور", exact: true })
    .click();
  await page.getByLabel("عدد الشرائح", { exact: true }).fill("24");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
  await page.getByRole("button", { name: "تصدير", exact: true }).click();
  await page.getByLabel("الدقة", { exact: true }).selectOption("2");
  await page
    .getByRole("button", { name: "تنزيل الملفات", exact: true })
    .click();
  await page
    .getByRole("button", { name: "إلغاء التصدير", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "تم إلغاء التصدير" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "العودة للتصميم", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /سحب الشريحة/ })).toHaveCount(
    24,
  );
});
test("previews a family switch and preserves edited content on apply and undo", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "اختيار ملاحظات مطور", exact: true })
    .click();
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await page
    .getByRole("textbox", { name: "العنوان", exact: true })
    .fill("عنواني المحفوظ");
  await page.getByRole("button", { name: "متابعة إلى التصميم" }).click();
  await page.getByRole("button", { name: "القالب", exact: true }).click();
  await page.getByLabel("التصميم", { exact: true }).selectOption("story");
  await expect(page.getByRole("main")).toContainText("عنواني المحفوظ");
  await page
    .getByRole("button", { name: "تطبيق على السلسلة", exact: true })
    .click();
  await expect(page.locator("[data-canvas-frame]")).toContainText(
    "عنواني المحفوظ",
  );
  await page.getByRole("button", { name: "تراجع", exact: true }).click();
  await expect(page.locator("[data-canvas-frame]")).toContainText(
    "عنواني المحفوظ",
  );
});
