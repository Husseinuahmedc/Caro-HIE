import { flattenLayers, type ProjectDocument } from "@/core/document";

export function collectDocumentFontIds(document: ProjectDocument): string[] {
  const fontIds = new Set<string>();
  for (const slide of document.slides) {
    for (const { layer } of flattenLayers(slide.layers)) {
      if (layer.type === "text" || layer.type === "code") fontIds.add(layer.fontFamilyId);
    }
  }
  return [...fontIds];
}
