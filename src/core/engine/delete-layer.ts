import type { Layer, SlideDocument } from "../document";
import { findLayerContext } from "./layer-tree";
import type { LayerOperationResult } from "./operation-result";

function removeLayer(layers: Layer[], layerId: string): Layer[] {
  return layers.flatMap((layer): Layer[] => {
    if (layer.id === layerId) return [];
    if (layer.type !== "group") return [layer];
    const children = removeLayer(layer.children, layerId);
    return children.length ? [{ ...layer, children }] : [];
  });
}

export function deleteLayer(slide: SlideDocument, layerId: string): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.parentLocked) return { slide, changed: false };
  return { slide: { ...slide, layers: removeLayer(slide.layers, layerId) }, changed: true };
}
