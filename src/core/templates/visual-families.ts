import {
  DEFAULT_BRAND_SETTINGS,
  createCodeLayer,
  createDocumentId,
  createShapeLayer,
  createTextLayer,
  flattenLayers,
  getFramePreset,
  type BrandSettings,
  type FramePreset,
  type Layer,
  type ProjectDocument,
  type SlideDocument,
} from "../document";
import type { RoleContentDefaults } from "./content-defaults";
import type { TemplateRole } from "./template-definition";

export const VISUAL_FAMILIES = [
  {
    id: "editorial",
    name: "تحرير جريء",
    category: "أفكار",
    description: "عنوان كبير. فكرة تستحق الوقوف عندها.",
    background: "#DEFF79",
    text: "#222823",
    accent: "#19454B",
  },
  {
    id: "developer",
    name: "ملاحظات مطور",
    category: "تقني",
    description: "الكود واضح، والشرح أقرب.",
    background: "#20272B",
    text: "#FFFFFF",
    accent: "#0AD8E2",
  },
  {
    id: "comparison",
    name: "مقارنة واضحة",
    category: "تعليمي",
    description: "مساحتان لقرار واحد: قبل وبعد.",
    background: "#D7CEF3",
    text: "#222823",
    accent: "#19454B",
  },
  {
    id: "steps",
    name: "خطوات عملية",
    category: "تعليمي",
    description: "خطوة واحدة في كل سحبة.",
    background: "#ED936F",
    text: "#222823",
    accent: "#19454B",
  },
  {
    id: "story",
    name: "حكاية بصرية",
    category: "أفكار",
    description: "مساحة لقصة، بإيقاع مختلف.",
    background: "#3455D7",
    text: "#FFFFFF",
    accent: "#DEFF79",
  },
  {
    id: "diagram",
    name: "شرح بصري",
    category: "تقني",
    description: "اربط الأفكار برسوم قابلة للتعديل.",
    background: "#F6F5F1",
    text: "#222823",
    accent: "#19454B",
  },
] as const;
export type VisualFamilyId = (typeof VISUAL_FAMILIES)[number]["id"];
export function getVisualFamily(id?: string) {
  return (
    VISUAL_FAMILIES.find((family) => family.id === id) ?? VISUAL_FAMILIES[0]
  );
}
export function createFamilyBrand(id: string): BrandSettings {
  const family = getVisualFamily(id);
  return {
    ...structuredClone(DEFAULT_BRAND_SETTINGS),
    headingFontId: "noto-sans-arabic",
    bodyFontId: "noto-sans-arabic",
    codeFontId: "ibm-plex-mono",
    radius: 16,
    colors: {
      background: family.background,
      surface: "#FFFFFF",
      text: family.text,
      muted: family.text === "#FFFFFF" ? "#DAE8DE" : "#222823",
      accent: family.accent,
      accentSoft: "#E5F5F2",
      codeBackground: "#19454B",
      codeText: "#DAE8DE",
      border: "#DDDFD6",
    },
  };
}

/** All artwork is native editable layers; the family chooses composition, not content. */
export function createFamilySlide(
  familyId: string,
  role: TemplateRole,
  content: RoleContentDefaults,
  brand: BrandSettings,
  frame: FramePreset,
  index: number,
  total: number,
): SlideDocument {
  const id = getVisualFamily(familyId).id;
  const sx = frame.width / 1080,
    sy = frame.height / 1350,
    unit = Math.min(
      (frame.width - frame.safeArea.left - frame.safeArea.right) / 936,
      (frame.height - frame.safeArea.top - frame.safeArea.bottom) / 1280,
    );
  const layers: Layer[] = [];
  const text = (
    name: string,
    value: string,
    x: number,
    y: number,
    w: number,
    h: number,
    size: number,
    color = brand.colors.text,
    key?: "title" | "body",
    weight = 700,
  ) =>
    layers.push(
      createTextLayer({
        name,
        content: value,
        x: x * sx,
        y: y * sy,
        width: w * sx,
        height: h * sy,
        fontSize: Math.max(8, size * unit),
        fontWeight: weight,
        lineHeight: 1.25,
        align: "right",
        direction: "rtl",
        color,
        fontFamilyId: key === "body" ? brand.bodyFontId : brand.headingFontId,
        ...(key ? { contentKey: key } : {}),
      }),
    );
  const box = (
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    radius = 0,
  ) =>
    layers.push(
      createShapeLayer({
        name,
        x: x * sx,
        y: y * sy,
        width: w * sx,
        height: h * sy,
        fill,
        stroke: fill,
        strokeWidth: 0,
        radius: radius * unit,
      }),
    );
  const cover = role.layout === "cover",
    close = role.layout === "cta";
  text(
    "ترقيم",
    `${String(index + 1).padStart(2, "0")} / ${total}`,
    72,
    62,
    260,
    64,
    30,
    brand.colors.muted,
    undefined,
    400,
  );
  text(
    "السلسلة",
    "Carousel Studio",
    530,
    62,
    478,
    64,
    30,
    brand.colors.muted,
    undefined,
    400,
  );
  if (id === "editorial") {
    text(
      "العنوان",
      content.title,
      72,
      cover ? 210 : 190,
      936,
      cover ? 610 : 380,
      cover ? 116 : 88,
      brand.colors.text,
      "title",
      900,
    );
    if (!cover) box("فاصل", 72, 610, 936, 3, brand.colors.text);
    text(
      "الوصف",
      content.body,
      72,
      cover ? 920 : 730,
      936,
      310,
      44,
      brand.colors.text,
      "body",
      400,
    );
  } else if (id === "developer" || role.layout === "code") {
    text(
      "العنوان",
      content.title,
      72,
      180,
      936,
      360,
      96,
      brand.colors.text,
      "title",
    );
    layers.push(
      createCodeLayer({
        name: "بطاقة الكود",
        x: 72 * sx,
        y: 590 * sy,
        width: 936 * sx,
        height: 410 * sy,
        code:
          content.code ??
          "const data =\n  await fetchData();\nconsole.log(data);",
        fontFamilyId: brand.codeFontId,
        fontSize: Math.max(8, 40 * unit),
        lineHeight: 1.4,
        padding: 40 * unit,
        radius: 8 * unit,
        background: brand.colors.codeBackground,
        color: brand.colors.codeText,
        theme: "midnight",
        showLineNumbers: false,
      }),
    );
    text(
      "الوصف",
      content.body,
      72,
      1060,
      936,
      230,
      40,
      brand.colors.muted,
      "body",
      400,
    );
  } else if (id === "comparison") {
    text(
      "العنوان",
      content.title,
      72,
      180,
      936,
      310,
      90,
      brand.colors.text,
      "title",
    );
    box("قبل", 72, 570, 450, 540, "#ED936F");
    box("بعد", 550, 570, 458, 540, "#DEFF79");
    text("وسم قبل", "قبل", 105, 610, 380, 80, 38, "#222823");
    text("وسم بعد", "بعد", 590, 610, 380, 80, 38, "#222823");
    text("نص قبل", content.body, 105, 740, 380, 330, 42, "#222823", "body", 400);
    text("نص بعد", content.after ?? "عنوان واضح\nفكرة واحدة\nمثال مباشر", 590, 740, 380, 330, 42, "#222823", undefined, 400);
  } else if (id === "steps") {
    box("رقم الخطوة", 72, 190, 200, 200, "#19454B", 16);
    text(
      "خطوة",
      close ? "تم" : cover ? "ابدأ" : String(index),
      90,
      215,
      165,
      150,
      cover ? 56 : 84,
      "#FFFFFF",
    );
    text(
      "العنوان",
      content.title,
      72,
      475,
      936,
      350,
      96,
      brand.colors.text,
      "title",
    );
    text(
      "الوصف",
      content.body,
      72,
      935,
      936,
      330,
      44,
      brand.colors.text,
      "body",
      400,
    );
  } else if (id === "story") {
    text(
      "العنوان",
      content.title,
      72,
      230,
      936,
      470,
      112,
      brand.colors.text,
      "title",
      900,
    );
    box("مساحة الحكاية", 72, 820, 936, 400, "#DEFF79");
    text("الوصف", content.body, 112, 865, 856, 310, 46, "#222823", "body", 400);
  } else {
    text(
      "العنوان",
      content.title,
      72,
      180,
      936,
      330,
      90,
      brand.colors.text,
      "title",
    );
    box("وصلة", 270, 722, 550, 4, "#19454B");
    ["طلب", "معالجة", "نتيجة"].forEach((label, i) => {
      const x = 72 + i * 324;
      box(label, x, 600, 288, 260, i === 1 ? "#DEFF79" : "#E5F5F2", 16);
      text(`وسم ${label}`, label, x + 24, 680, 240, 100, 42, "#19454B");
    });
    text(
      "الوصف",
      content.body,
      72,
      1000,
      936,
      270,
      44,
      brand.colors.text,
      "body",
      400,
    );
  }
  const numbering = layers.find((layer) => layer.name === "ترقيم");
  if (numbering?.type === "text") {
    numbering.contentKey = "slide-number";
    numbering.locked = true;
  }
  // Adapt the reference composition to the safe area at every requested size.
  const areaWidth = frame.width - frame.safeArea.left - frame.safeArea.right;
  const areaHeight = frame.height - frame.safeArea.top - frame.safeArea.bottom;
  for (const layer of layers) {
    layer.x = frame.safeArea.left + ((layer.x / sx - 72) / 936) * areaWidth;
    layer.y = frame.safeArea.top + ((layer.y / sy - 62) / 1280) * areaHeight;
    layer.width = (layer.width / sx / 936) * areaWidth;
    layer.height = (layer.height / sy / 1280) * areaHeight;
  }
  if (numbering?.type === "text") {
    numbering.direction = "ltr";
    numbering.align = "left";
  }
  // Keep code in every family when switching a populated slide with code content.
  if (
    content.code !== undefined &&
    !layers.some((layer) => layer.type === "code")
  ) {
    layers.push(
      createCodeLayer({
        name: "الكود المحفوظ",
        code: content.code,
        x: 72 * sx,
        y: 900 * sy,
        width: 936 * sx,
        height: 350 * sy,
        fontSize: Math.max(8, 32 * unit),
        fontFamilyId: brand.codeFontId,
        background: brand.colors.codeBackground,
        color: brand.colors.codeText,
      }),
    );
  }
  return {
    id: createDocumentId("slide"),
    name: role.label,
    role: role.id,
    layers,
  };
}

export function restyleDocument(
  document: ProjectDocument,
  familyId: string,
): ProjectDocument {
  const brand = createFamilyBrand(familyId),
    frame = getFramePreset(document.framePresetId, document.customFrame);
  return {
    ...document,
    visualFamilyId: familyId,
    brand,
    brandKitId: null,
    slides: document.slides.map((slide, index) => {
      const flat = flattenLayers(slide.layers).map(({ layer }) => layer);
      const title = flat.find(
        (layer) => layer.type === "text" && layer.contentKey === "title",
      );
      const body = flat.find(
        (layer) => layer.type === "text" && layer.contentKey === "body",
      );
      const code = flat.find((layer) => layer.type === "code");
      const after = flat.find((layer) => layer.type === "text" && layer.name === "نص بعد");
      const content = {
        title: title?.type === "text" ? title.content : slide.name,
        body: body?.type === "text" ? body.content : "",
        ...(code?.type === "code" ? { code: code.code } : {}),
        ...(after?.type === "text" ? { after: after.content } : {}),
      };
      const role: TemplateRole = {
        id: slide.role ?? "custom",
        label: slide.name,
        hint: "",
        layout:
          index === 0
            ? "cover"
            : index === document.slides.length - 1
              ? "cta"
              : code
                ? "code"
                : "body",
      };
      const result = createFamilySlide(
        familyId,
        role,
        content,
        brand,
        frame,
        index,
        document.slides.length,
      );
      // Consume only the exact layers represented in the new composition.
      // Duplicate keyed text and additional code blocks remain editable extras.
      const replacedIds = new Set([title?.id, body?.id, code?.id]);
      if (result.layers.some((layer) => layer.name === "نص بعد")) replacedIds.add(after?.id);
      // Additional user text, images, groups and shapes survive reflow unchanged.
      const extras = slide.layers.filter(
        (layer) =>
          !replacedIds.has(layer.id) &&
          ![
            "ترقيم",
            "السلسلة",
            "فاصل",
            "قبل",
            "بعد",
            "وسم قبل",
            "وسم بعد",
            "رقم الخطوة",
            "خطوة",
            "مساحة الحكاية",
            "وصلة",
            "طلب",
            "معالجة",
            "نتيجة",
            "وسم طلب",
            "وسم معالجة",
            "وسم نتيجة",
          ].includes(layer.name),
      );
      return { ...result, id: slide.id, layers: [...result.layers, ...extras] };
    }),
  };
}

/** Authored examples demonstrate each visual family without making product claims. */
export function getFamilyContentDefaults(
  familyId: string,
  role: TemplateRole,
): RoleContentDefaults {
  const family = getVisualFamily(familyId).id;
  const phase = role.layout === "cover" ? 0 : role.layout === "cta" ? 2 : 1;
  const examples: Record<
    VisualFamilyId,
    [RoleContentDefaults, RoleContentDefaults, RoleContentDefaults]
  > = {
    editorial: [
      { title: "فكرتك\nتستحق\nالسحبة.", body: "حوّل الفكرة إلى كاروسيل واضح." },
      { title: "فكرة واحدة.\nشرح أوضح.", body: "مساحة للنَفَس، ومثال للفكرة." },
      {
        title: "قلّ الكلام.\nزِد المعنى.",
        body: "خذ فكرة واحدة وابدأ بتطبيقها.",
      },
    ],
    developer: [
      {
        title: "الكود صح.\nليش النتيجة\nغلط؟",
        body: "دليل صغير لفهم async / await",
      },
      {
        title: "انتظر النتيجة،\nوبعدين استخدمها.",
        body: "await توقف الدالة الحالية لحد ما يكتمل الطلب.",
      },
      { title: "جرّبها بنفسك.", body: "أضف معالجة الخطأ، وراقب النتيجة." },
    ],
    comparison: [
      { title: "نفس الفكرة.\nفرق بالنتيجة.", body: "عنوان طويل\nأكثر من فكرة\nتفاصيل مبعثرة", after: "عنوان واضح\nفكرة واحدة\nمثال مباشر" },
      { title: "قبل / بعد", body: "فقرة مزدحمة\nبدون مثال\nصعب تتذكرها", after: "شرح مختصر\nمثال عملي\nفكرة تتذكرها" },
      {
        title: "التفاصيل\nتغيّر التصميم.",
        body: "انشر بسرعة\nبدون مراجعة",
        after: "راجع المقارنة\nواختَر الأوضح",
      },
    ],
    steps: [
      {
        title: "ابدأ أقل.\nأنجز أكثر.",
        body: "اكتب الفكرة، اختَر التصميم، ثم صدّر وشارك.",
      },
      {
        title: "رتّبها\nخطوة بخطوة.",
        body: "حركة واحدة واضحة، وبعدها تأكد من النتيجة.",
      },
      { title: "خطوتك الجاية؟", body: "ابدأ اليوم بفكرة صغيرة." },
    ],
    story: [
      {
        title: "مو كل فكرة\nتبدي كاملة.",
        body: "من ملاحظة صغيرة\nإلى قصة تنحچي.",
      },
      { title: "المسودة\nهي البداية.", body: "اكتب. جرّب. عدّل." },
      { title: "خلّ فكرتك\nتشوف النور.", body: "شنو أول فكرة تريد تحچيها؟" },
    ],
    diagram: [
      {
        title: "من المتصفح\nإلى السيرفر.",
        body: "كل جزء إله وظيفة. افهم العلاقة، وبعدين التفاصيل.",
      },
      {
        title: "الطلب يمشي\nبهذا المسار.",
        body: "المتصفح يرسل الطلب، والخادم يرجّع النتيجة.",
      },
      { title: "صارت أوضح؟", body: "ارسم مسار الطلب لفكرتك القادمة." },
    ],
  };
  const content = structuredClone(examples[family][phase]);
  if (family === "developer" || role.layout === "code")
    content.code =
      phase === 2
        ? "try {\n  await fetchData();\n} catch (error) {}"
        : "const data =\n  await fetchData();\nconsole.log(data);";
  return content;
}
