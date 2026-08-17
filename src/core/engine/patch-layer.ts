import type { Layer, SlideDocument } from "../document";
import { findLayerContext, updateLayerInTree } from "./layer-tree";
import type { LayerOperationResult } from "./operation-result";

export function patchLayer(
  slide: SlideDocument,
  layerId: string,
  patch: Partial<Layer>,
): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.parentLocked || (context.layer.locked && patch.locked === undefined)) {
    return { slide, changed: false };
  }
  return {
    slide: {
      ...slide,
      layers: updateLayerInTree(slide.layers, layerId, (layer) => ({ ...layer, ...patch }) as Layer),
    },
    changed: true,
  };
}

export function toggleLayerLock(slide: SlideDocument, layerId: string): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.parentLocked) return { slide, changed: false };
  return patchLayer(slide, layerId, { locked: !context.layer.locked });
}

export function toggleLayerVisibility(slide: SlideDocument, layerId: string): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context) return { slide, changed: false };
  return {
    slide: {
      ...slide,
      layers: updateLayerInTree(slide.layers, layerId, (layer) => ({
        ...layer,
        visible: !layer.visible,
      })),
    },
    changed: true,
  };
}
