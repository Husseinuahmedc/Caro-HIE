import type { GroupLayer, Layer, ProjectDocument, SlideDocument } from "./types";

export interface LayerEntry {
  layer: Layer;
  depth: number;
  parentId: string | null;
}

export function getSlide(document: ProjectDocument, slideId: string): SlideDocument | null {
  return document.slides.find((slide) => slide.id === slideId) ?? null;
}

export function getLayer(layers: Layer[], layerId: string): Layer | null {
  for (const layer of layers) {
    if (layer.id === layerId) return layer;
    if (layer.type === "group") {
      const child = getLayer(layer.children, layerId);
      if (child) return child;
    }
  }
  return null;
}

export function flattenLayers(
  layers: Layer[],
  depth = 0,
  parentId: string | null = null,
): LayerEntry[] {
  return layers.flatMap((layer) => [
    { layer, depth, parentId },
    ...(layer.type === "group" ? flattenLayers(layer.children, depth + 1, layer.id) : []),
  ]);
}

export function collectAssetIds(document: ProjectDocument): string[] {
  const ids = new Set<string>();
  for (const slide of document.slides) {
    for (const { layer } of flattenLayers(slide.layers)) {
      if (layer.type === "image" && layer.assetId) ids.add(layer.assetId);
    }
  }
  return [...ids];
}

export function isGroupLayer(layer: Layer): layer is GroupLayer {
  return layer.type === "group";
}
