import { createDocumentId } from "../ids";
import type { BrandSettings, FramePresetId } from "../types";
import { DEFAULT_BRAND_SETTINGS, createTextLayer } from "../defaults";
import {
  arrayOrEmpty,
  booleanOr,
  hexOr,
  numberOr,
  recordOrEmpty,
  stringOr,
  type UnknownRecord,
} from "./migration-values";

export interface ExtractedLegacyAsset {
  id: string;
  name: string;
  source: string;
}

export interface VersionOneMigrationResult {
  document: UnknownRecord;
  extractedAssets: ExtractedLegacyAsset[];
}

function migrateBrand(themeValue: unknown): BrandSettings {
  const theme = recordOrEmpty(themeValue);
  const defaults = DEFAULT_BRAND_SETTINGS.colors;
  return {
    colors: {
      background: hexOr(theme.background, defaults.background),
      surface: hexOr(theme.surface, defaults.surface),
      accent: hexOr(theme.accent, defaults.accent),
      accentSoft: hexOr(theme.accentSoft, defaults.accentSoft),
      text: hexOr(theme.text, defaults.text),
      muted: hexOr(theme.muted, defaults.muted),
      codeBackground: hexOr(theme.codeBackground, defaults.codeBackground),
      codeText: hexOr(theme.codeText, defaults.codeText),
      border: hexOr(theme.border, defaults.border),
    },
    headingFontId: "noto-kufi-arabic",
    bodyFontId: "ibm-plex-sans-arabic",
    codeFontId: "system-mono",
    radius: 28,
  };
}

function migrateBaseLayer(layer: UnknownRecord) {
  return {
    id: stringOr(layer.id, createDocumentId("layer")),
    name: stringOr(layer.name, "عنصر"),
    x: numberOr(layer.x, 0),
    y: numberOr(layer.y, 0),
    width: Math.max(1, numberOr(layer.width, 100)),
    height: Math.max(1, numberOr(layer.height, 100)),
    rotation: numberOr(layer.rotation, 0),
    opacity: Math.min(1, Math.max(0, numberOr(layer.opacity, 1))),
    visible: booleanOr(layer.visible, true),
    locked: booleanOr(layer.locked, false),
  };
}

function migrateLayer(
  value: unknown,
  extractedAssets: ExtractedLegacyAsset[],
): UnknownRecord {
  const layer = recordOrEmpty(value);
  const type = stringOr(layer.type, "text");
  const base = migrateBaseLayer(layer);

  if (type === "text") {
    return {
      ...base,
      type,
      content: stringOr(layer.content, ""),
      direction: layer.direction === "ltr" ? "ltr" : "rtl",
      align: ["right", "center", "left"].includes(String(layer.align)) ? layer.align : "center",
      verticalAlign: "middle",
      fontFamilyId: "noto-kufi-arabic",
      fontSize: numberOr(layer.fontSize, 48),
      fontWeight: Math.min(900, Math.max(100, numberOr(layer.fontWeight, 700))),
      lineHeight: numberOr(layer.lineHeight, 1.25),
      letterSpacing: 0,
      color: hexOr(layer.color, DEFAULT_BRAND_SETTINGS.colors.text),
      ...(layer.contentKey === "title" || layer.contentKey === "body"
        ? { contentKey: layer.contentKey }
        : {}),
    };
  }

  if (type === "code") {
    return {
      ...base,
      type,
      code: stringOr(layer.code, ""),
      language: stringOr(layer.language, "typescript"),
      fontFamilyId: "system-mono",
      fontSize: numberOr(layer.fontSize, 26),
      lineHeight: 1.5,
      padding: 34,
      radius: numberOr(layer.radius, 24),
      background: hexOr(layer.background, DEFAULT_BRAND_SETTINGS.colors.codeBackground),
      color: hexOr(layer.color, DEFAULT_BRAND_SETTINGS.colors.codeText),
    };
  }

  if (type === "shape") {
    return {
      ...base,
      type,
      shape: ["rect", "circle", "line"].includes(String(layer.shape)) ? layer.shape : "rect",
      fill: hexOr(layer.fill, DEFAULT_BRAND_SETTINGS.colors.accentSoft),
      stroke: hexOr(layer.stroke, DEFAULT_BRAND_SETTINGS.colors.accent),
      strokeWidth: numberOr(layer.strokeWidth, 0),
      radius: numberOr(layer.radius, 0),
      ...(layer.contentKey === "surface" ? { contentKey: "surface" } : {}),
    };
  }

  if (type === "icon") {
    return {
      ...base,
      type,
      icon: stringOr(layer.icon, "✦"),
      color: hexOr(layer.color, DEFAULT_BRAND_SETTINGS.colors.accent),
      fontSize: numberOr(layer.fontSize, 72),
    };
  }

  if (type === "image") {
    const source = stringOr(layer.src, "");
    const assetId = source ? createDocumentId("asset") : null;
    if (source && assetId) {
      extractedAssets.push({ id: assetId, name: stringOr(layer.name, "صورة مستوردة"), source });
    }
    return {
      ...base,
      type,
      assetId,
      alt: stringOr(layer.alt, "صورة"),
      fit: layer.fit === "contain" ? "contain" : "cover",
      radius: numberOr(layer.radius, 0),
    };
  }

  if (type === "group") {
    const children = arrayOrEmpty(layer.children).map((child) =>
      migrateLayer(child, extractedAssets),
    );
    return {
      ...base,
      type,
      children: children.length ? children : [createTextLayer({ content: "مجموعة مستوردة" })],
    };
  }

  return createTextLayer({ ...base, content: "عنصر غير مدعوم من النسخة القديمة" }) as unknown as UnknownRecord;
}

function migrateFrame(value: unknown): FramePresetId {
  return value === "portrait" || value === "story" ? value : "square";
}

export function migrateVersionOneToTwo(input: UnknownRecord): VersionOneMigrationResult {
  const extractedAssets: ExtractedLegacyAsset[] = [];
  const now = new Date().toISOString();
  const slides = arrayOrEmpty(input.slides)
    .slice(0, 9)
    .map((slideValue, index) => {
      const slide = recordOrEmpty(slideValue);
      const layers = arrayOrEmpty(slide.layers).map((layer) => migrateLayer(layer, extractedAssets));
      return {
        id: stringOr(slide.id, createDocumentId("slide")),
        name: stringOr(slide.name, `شريحة ${index + 1}`),
        ...(typeof slide.role === "string" ? { role: slide.role } : {}),
        layers,
      };
    });

  return {
    document: {
      schemaVersion: 2,
      id: stringOr(input.id, createDocumentId("project")),
      name: stringOr(input.name, "مشروع مستورد"),
      series: stringOr(input.series, "سلسلة مستوردة"),
      framePresetId: migrateFrame(input.frame),
      brand: migrateBrand(input.theme),
      slides: slides.length
        ? slides
        : [
            {
              id: createDocumentId("slide"),
              name: "الغلاف",
              role: "cover",
              layers: [createTextLayer({ content: "مشروع مستورد" })],
            },
          ],
      revision: Math.max(0, Math.floor(numberOr(input.revision, 0))),
      createdAt: stringOr(input.createdAt, now),
      updatedAt: stringOr(input.updatedAt, now),
      ...(input.contentPlan ? { contentPlan: input.contentPlan } : {}),
      ...(typeof input.templateId === "string" ? { templateId: input.templateId } : {}),
      ...(typeof input.brandKitId === "string" ? { brandKitId: input.brandKitId } : {}),
    },
    extractedAssets,
  };
}
