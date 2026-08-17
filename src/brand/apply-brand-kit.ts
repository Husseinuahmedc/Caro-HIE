import type { BrandSettings, Layer, ProjectDocument } from "@/core/document";

function applyBrandToLayer(layer: Layer, brand: BrandSettings): Layer {
  if (layer.type === "group") {
    return { ...layer, children: layer.children.map((child) => applyBrandToLayer(child, brand)) };
  }
  if (layer.type === "text") {
    return {
      ...layer,
      fontFamilyId: layer.contentKey === "title" ? brand.headingFontId : brand.bodyFontId,
      color: layer.contentKey === "body" ? brand.colors.muted : brand.colors.text,
    };
  }
  if (layer.type === "code") {
    return {
      ...layer,
      fontFamilyId: brand.codeFontId,
      background: brand.colors.codeBackground,
      color: brand.colors.codeText,
      radius: brand.radius,
    };
  }
  if (layer.type === "shape" && layer.contentKey === "surface") {
    return {
      ...layer,
      fill: brand.colors.accentSoft,
      stroke: brand.colors.accent,
      radius: brand.radius,
    };
  }
  return layer;
}

export function applyBrandSettings(
  document: ProjectDocument,
  brand: BrandSettings,
  brandKitId: string | null,
): ProjectDocument {
  return {
    ...document,
    brandKitId,
    brand: structuredClone(brand),
    slides: document.slides.map((slide) => ({
      ...slide,
      layers: slide.layers.map((layer) => applyBrandToLayer(layer, brand)),
    })),
  };
}
