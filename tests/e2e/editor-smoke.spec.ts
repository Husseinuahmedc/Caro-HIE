import { expect, test, type Locator, type Page } from "@playwright/test";

async function createProject(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "إنشاء وكتابة المحتوى" }).click();
  await expect(page.getByRole("dialog", {name: "محتوى السلسلة"})).toBeVisible();
  await page.getByRole("button", {name: "متابعة إلى التصميم"}).click();
  await expect(page.locator("[data-canvas-frame]")).toBeVisible();
}

async function textPosition(span: Locator) {
  return span.evaluate((element) => {
    const frame = element.parentElement!;
    const box = frame.getBoundingClientRect();
    const scale = box.width / frame.offsetWidth;
    const line = element.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    const text = range.getBoundingClientRect();
    return {
      left: (text.left - box.left) / scale,
      right: (box.right - text.right) / scale,
      top: (line.top - box.top) / scale,
      bottom: (box.bottom - line.bottom) / scale,
    };
  });
}

test("aligns text on independent axes in the canvas, inline editor and SVG export", async ({ page, context }) => {
  test.setTimeout(120_000);
  await createProject(page);
  await page.getByRole("button", {name: "إضافة نص", exact: true}).click();
  await page.getByRole("textbox", {name: "المحتوى", exact: true}).fill("مرحبا Hello");
  await page.evaluate(() => document.fonts.ready);
  const layer = page.locator("[data-canvas-frame] [data-layer-type='text']").last();
  const id = await layer.getAttribute("data-layer-id");
  const exportedPage = await context.newPage();

  for (const direction of ["rtl", "ltr"]) {
    await page.getByLabel("الاتجاه", {exact: true}).selectOption(direction);
    for (const [align, label] of [["right", "محاذاة يمين"], ["center", "محاذاة وسط"], ["left", "محاذاة يسار"]]) {
      await page.getByRole("button", {name: label, exact: true}).click();
      await expect(page.getByLabel("المحاذاة", {exact: true})).toHaveValue(align);
      for (const vertical of ["top", "middle", "bottom"]) {
        await page.getByLabel("المحاذاة العمودية", {exact: true}).selectOption(vertical);
        await expect.poll(async () => {
          const p = await textPosition(layer.locator("span"));
          return Math.abs(align === "left" ? p.left : align === "right" ? p.right : p.left - p.right);
        }).toBeLessThan(2);
        await expect.poll(async () => {
          const p = await textPosition(layer.locator("span"));
          return Math.abs(vertical === "top" ? p.top : vertical === "bottom" ? p.bottom : p.top - p.bottom);
        }).toBeLessThan(2);
      }

      const before = await textPosition(layer.locator("span"));
      await page.getByRole("button", {name: "تحرير النص", exact: true}).click();
      const editor = page.getByRole("textbox", {name: "تحرير النص مباشرة"});
      const during = await textPosition(editor);
      for (const edge of ["left", "right", "top", "bottom"] as const) {
        expect(Math.abs(during[edge] - before[edge])).toBeLessThan(2);
      }
      await editor.press("Control+Enter");

      await page.getByRole("button", {name: "تصدير", exact: true}).click();
      const dialog = page.getByRole("dialog", {name: "تصدير السلسلة"});
      await dialog.getByLabel("الشرائح", {exact: true}).selectOption("current");
      await dialog.getByLabel("الصيغة", {exact: true}).selectOption("svg");
      const pending = page.waitForEvent("download");
      await dialog.getByRole("button", {name: "تنزيل الملفات"}).click();
      const download = await pending;
      const stream = await download.createReadStream();
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      await exportedPage.setContent(Buffer.concat(chunks).toString());
      await exportedPage.evaluate(() => document.fonts.ready);
      const bounds = await exportedPage.locator(`text[clip-path="url(#text-clip-${id})"]`).evaluate((element) => {
        const text = element as SVGTextElement;
        const box = text.getBBox();
        const width = Number(text.parentElement!.querySelector("clipPath rect")!.getAttribute("width"));
        return {left: box.x, right: width - box.x - box.width};
      });
      expect(bounds.left).toBeGreaterThanOrEqual(-3);
      expect(bounds.right).toBeGreaterThanOrEqual(-3);
      expect(Math.abs(align === "left" ? bounds.left : align === "right" ? bounds.right : bounds.left - bounds.right)).toBeLessThan(3);
      await dialog.getByRole("button", {name: "إغلاق", exact: true}).click();
    }
  }
  await exportedPage.close();
});

test("edits text directly, keeps the planner current, and reopens the saved project", async ({ page }) => {
  await createProject(page);
  await page.getByRole("textbox", {name: "اسم المشروع", exact: true}).fill("تجربة الإصدار الثاني");
  const title = page.locator("[data-canvas-frame] [data-layer-type='text']").first();
  const id = await title.getAttribute("data-layer-id");
  await page.locator(`[data-hit-layer="${id}"]`).dblclick();
  await page.getByRole("textbox", {name: "تحرير النص مباشرة"}).fill("عنوان كتبته داخل التصميم");
  await page.getByRole("textbox", {name: "تحرير النص مباشرة"}).press("Control+Enter");
  await expect(title).toHaveText("عنوان كتبته داخل التصميم");
  await page.getByRole("button", {name: "المحتوى", exact: true}).click();
  await expect(page.getByRole("dialog").getByRole("textbox", {name: "العنوان الرئيسي", exact: true}).first()).toHaveValue("عنوان كتبته داخل التصميم");
  await page.getByRole("button", {name: "متابعة إلى التصميم"}).click();
  await expect(page.getByRole("status").filter({hasText: "محفوظ في هذا المتصفح"})).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", {name: "تجربة الإصدار الثاني"})).toBeVisible();
  await page.getByRole("button", {name: "فتح المشروع"}).click();
  await expect(page.locator("[data-canvas-frame]")).toContainText("عنوان كتبته داخل التصميم");
});

test("keeps mobile navigation, slide controls and properties reachable", async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await createProject(page);
  await expect(page.getByRole("button", {name: "ملاءمة الشاشة"})).toBeVisible();
  await expect(page.locator("[data-canvas-frame]")).toBeInViewport();
  await page.getByRole("button", {name: "الشرائح والطبقات", exact: true}).click();
  const navigation = page.getByRole("dialog", {name: "الشرائح والطبقات"});
  const initial = await navigation.getByRole("button", {name: /سحب الشريحة/}).count();
  await navigation.getByRole("button", {name: "إضافة شريحة", exact: true}).click();
  await expect(navigation.getByRole("button", {name: /سحب الشريحة/})).toHaveCount(initial + 1);
  await navigation.getByRole("button", {name: "إغلاق", exact: true}).click();
  await page.getByRole("button", {name: "إضافة نص", exact: true}).click();
  await page.getByRole("button", {name: "خصائص", exact: true}).click();
  const inspector = page.getByRole("dialog", {name: "خصائص العنصر"});
  await inspector.getByRole("textbox", {name: "المحتوى", exact: true}).fill("تعديل من الهاتف");
  await inspector.getByRole("button", {name: "إغلاق", exact: true}).click();
  await expect(page.locator("[data-canvas-frame]")).toContainText("تعديل من الهاتف");
});

test("exports the whole series, one slide, and a restorable backup", async ({ page }) => {
  await createProject(page);
  await page.getByRole("button", {name: "تصدير", exact: true}).click();
  const dialog = page.getByRole("dialog", {name: "تصدير السلسلة"});
  let downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", {name: "تنزيل الملفات"}).click();
  let download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/-png\.zip$/);

  await dialog.getByLabel("الشرائح", {exact: true}).selectOption("current");
  for (const format of ["png", "svg", "pdf"]) {
    await dialog.getByLabel("الصيغة", {exact: true}).selectOption(format);
    downloadPromise = page.waitForEvent("download");
    await dialog.getByRole("button", {name: "تنزيل الملفات"}).click();
    download = await downloadPromise;
    const stream = await download.createReadStream();
    let size = 0;
    for await (const chunk of stream) size += chunk.length;
    expect(size).toBeGreaterThan(200);
    expect(download.suggestedFilename()).toMatch(new RegExp(`\\.${format}$`));
  }
  await dialog.getByText("نسخة احتياطية وبيانات المشروع", {exact: true}).click();
  downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", {name: "تنزيل نسخة احتياطية", exact: true}).click();
  download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const backup = Buffer.concat(chunks);
  expect(JSON.parse(backup.toString()).format).toBe("caro-hie-backup");
  await dialog.getByRole("button", {name: "إغلاق", exact: true}).click();
  await page.getByRole("button", {name: "العودة إلى المشاريع"}).click();
  await page.getByLabel("ملف النسخة الاحتياطية").setInputFiles({name: "backup.json", mimeType: "application/json", buffer: backup});
  await expect(page.getByRole("textbox", {name: "اسم المشروع", exact: true})).toHaveValue(/مستعاد/);
});

test("reorders layers and exposes code and icon controls", async ({ page }) => {
  await createProject(page);
  await page.getByRole("button", {name: "إضافة شكل"}).click();
  await page.getByRole("button", {name: "إضافة أيقونة"}).click();
  const navigation = page.getByRole("complementary", {name: "الشرائح والطبقات"});
  await navigation.getByRole("tab", {name: "الطبقات", exact: true}).click();
  await navigation.getByRole("button", {name: "شكل", exact: true}).click();
  await navigation.getByRole("button", {name: "إلى المقدمة", exact: true}).click();
  await expect(page.locator("[data-canvas-frame] [data-slide-id]").first().locator(":scope > [data-layer-id]").last()).toHaveAttribute("data-layer-type", "shape");
  await page.getByRole("button", {name: "إضافة كود"}).click();
  await page.getByLabel("اللغة", {exact: true}).selectOption("tsx");
  await page.getByLabel("تمييز الأسطر", {exact: true}).fill("1, 3");
  await page.getByLabel("تمييز الأسطر", {exact: true}).press("Tab");
  await page.getByRole("button", {name: "إضافة أيقونة"}).click();
  await page.getByLabel("مكتبة الأيقونات").fill("قاعدة بيانات");
  await page.getByRole("button", {name: "قاعدة بيانات", exact: true}).click();
  await expect(page.locator("[data-canvas-frame] [data-layer-type='icon']").last().locator("svg ellipse")).toBeVisible();
});
