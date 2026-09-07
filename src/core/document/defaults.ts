import { createDocumentId } from "./ids";
import {
  CURRENT_SCHEMA_VERSION,
  type BrandSettings,
  type CodeLayer,
  type ContentPlan,
  type IconLayer,
  type ImageLayer,
  type ProjectDocument,
  type ShapeLayer,
  type SlideDocument,
  type TextLayer,
} from "./types";

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  colors: {
    background: "#eadfce",
    surface: "#fffaf2",
    accent: "#c97950",
    accentSoft: "#e9b896",
    text: "#32231f",
    muted: "#6e574c",
    codeBackground: "#2d211d",
    codeText: "#fff8ec",
    border: "#d9aa88",
  },
  headingFontId: "noto-kufi-arabic",
  bodyFontId: "ibm-plex-sans-arabic",
  codeFontId: "system-mono",
  radius: 28,
};

const baseLayer = () => ({
  x: 110,
  y: 150,
  width: 860,
  height: 160,
  rotation: 0,
  opacity: 1,
  visible: true,
  locked: false,
});

export function createTextLayer(overrides: Partial<TextLayer> = {}): TextLayer {
  return {
    ...baseLayer(),
    id: createDocumentId("text"),
    type: "text",
    name: "نص",
    content: "اكتب عنوانك هنا",
    direction: "rtl",
    align: "center",
    verticalAlign: "middle",
    fontFamilyId: DEFAULT_BRAND_SETTINGS.headingFontId,
    fontSize: 64,
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: 0,
    color: DEFAULT_BRAND_SETTINGS.colors.text,
    ...overrides,
  };
}

export function createCodeLayer(overrides: Partial<CodeLayer> = {}): CodeLayer {
  return {
    ...baseLayer(),
    id: createDocumentId("code"),
    type: "code",
    name: "كود",
    y: 530,
    height: 250,
    code: "const user = await auth.getUser()",
    language: "typescript",
    theme: "sand",
    showLineNumbers: true,
    highlightedLines: [],
    fontFamilyId: DEFAULT_BRAND_SETTINGS.codeFontId,
    fontSize: 28,
    lineHeight: 1.5,
    padding: 34,
    radius: 26,
    background: DEFAULT_BRAND_SETTINGS.colors.codeBackground,
    color: DEFAULT_BRAND_SETTINGS.colors.codeText,
    ...overrides,
  };
}

export function createShapeLayer(overrides: Partial<ShapeLayer> = {}): ShapeLayer {
  return {
    ...baseLayer(),
    id: createDocumentId("shape"),
    type: "shape",
    name: "شكل",
    x: 120,
    y: 120,
    width: 840,
    height: 480,
    shape: "rect",
    fill: DEFAULT_BRAND_SETTINGS.colors.accentSoft,
    stroke: DEFAULT_BRAND_SETTINGS.colors.accent,
    strokeWidth: 4,
    radius: 32,
    ...overrides,
  };
}

export function createIconLayer(overrides: Partial<IconLayer> = {}): IconLayer {
  return {
    ...baseLayer(),
    id: createDocumentId("icon"),
    type: "icon",
    name: "أيقونة",
    x: 90,
    y: 80,
    width: 120,
    height: 120,
    icon: "sparkles",
    color: DEFAULT_BRAND_SETTINGS.colors.accent,
    fill: "none",
    strokeWidth: 2,
    fontSize: 88,
    ...overrides,
  };
}

export function createImageLayer(overrides: Partial<ImageLayer> = {}): ImageLayer {
  return {
    ...baseLayer(),
    id: createDocumentId("image"),
    type: "image",
    name: "صورة",
    x: 120,
    y: 160,
    width: 840,
    height: 540,
    assetId: null,
    alt: "صورة",
    fit: "cover",
    radius: 28,
    ...overrides,
  };
}

function emptyContentPlan(slide: SlideDocument): ContentPlan {
  return {
    goal: "شرح الفكرة بدون حشو",
    audience: "صنّاع المحتوى والمطورون العرب",
    hook: "شنو يصير فعلياً؟",
    tone: "واضح ومباشر",
    slides: [
      {
        id: "cover",
        role: "cover",
        label: slide.name,
        hint: "وعد واضح للقارئ",
        title: "عنوان السلسلة هنا",
        body: "وعد واضح للقارئ من أول نظرة",
      },
    ],
  };
}

export function createBlankProjectDocument(): ProjectDocument {
  const now = new Date().toISOString();
  const slide: SlideDocument = {
    id: createDocumentId("slide"),
    name: "الغلاف",
    role: "cover",
    layers: [
      createTextLayer({
        name: "العنوان الرئيسي",
        x: 90,
        y: 330,
        width: 900,
        height: 210,
        content: "ابدأ فكرتك من هنا",
        fontSize: 76,
      }),
    ],
  };

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: createDocumentId("project"),
    name: "مشروع جديد",
    series: "سلسلة جديدة",
    framePresetId: "square",
    templateId: "custom",
    brandKitId: null,
    brand: structuredClone(DEFAULT_BRAND_SETTINGS),
    slides: [slide],
    contentPlan: emptyContentPlan(slide),
    revision: 0,
    createdAt: now,
    updatedAt: now,
  };
}
