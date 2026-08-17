import type { SlideDocument } from "../document";
import { findLayerContext, updateLayerInTree } from "./layer-tree";
import { normalizeRotation } from "./numbers";
import type { LayerOperationResult } from "./operation-result";

export function rotateLayer(
  slide: SlideDocument,
  layerId: string,
  rotation: number,
): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.layer.locked || context.parentLocked) return { slide, changed: false };
  const normalized = normalizeRotation(rotation);
  if (normalized === context.layer.rotation) return { slide, changed: false };
  return {
    slide: {
      ...slide,
      layers: updateLayerInTree(slide.layers, layerId, (layer) => ({ ...layer, rotation: normalized })),
    },
    changed: true,
  };
}
