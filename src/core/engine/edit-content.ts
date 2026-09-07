import type { SlideDocument } from "../document";
import { findLayerContext } from "./layer-tree";
import { patchLayer } from "./patch-layer";

export function editLayerContent(slide: SlideDocument, layerId: string, content: string) {
  const layer = findLayerContext(slide.layers, layerId)?.layer;
  if (layer?.type === "text") return patchLayer(slide, layerId, {content});
  if (layer?.type === "code") return patchLayer(slide, layerId, {code: content});
  return {slide, changed: false};
}
