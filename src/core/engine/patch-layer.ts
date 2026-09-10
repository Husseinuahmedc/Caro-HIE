import type { Layer, SlideDocument } from "../document";
import { findLayerContext, updateLayerInTree } from "./layer-tree";
import type { LayerOperationResult } from "./operation-result";

function isLayerPatchValid(patch: Partial<Layer>): boolean {
  if ("width" in patch && (typeof patch.width !== "number" || !Number.isFinite(patch.width) || patch.width <= 0)) {
    return false;
  }
  if ("height" in patch && (typeof patch.height !== "number" || !Number.isFinite(patch.height) || patch.height <= 0)) {
    return false;
  }
  if ("x" in patch && (typeof patch.x !== "number" || !Number.isFinite(patch.x))) {
    return false;
  }
  if ("y" in patch && (typeof patch.y !== "number" || !Number.isFinite(patch.y))) {
    return false;
  }
  if ("rotation" in patch && (typeof patch.rotation !== "number" || !Number.isFinite(patch.rotation))) {
    return false;
  }
  if ("opacity" in patch && (typeof patch.opacity !== "number" || !Number.isFinite(patch.opacity) || patch.opacity < 0 || patch.opacity > 1)) {
    return false;
  }
  const anyPatch = patch as Record<string, unknown>;
  if ("fontSize" in anyPatch && (typeof anyPatch.fontSize !== "number" || !Number.isFinite(anyPatch.fontSize) || anyPatch.fontSize < 8)) {
    return false;
  }
  if ("lineHeight" in anyPatch && (typeof anyPatch.lineHeight !== "number" || !Number.isFinite(anyPatch.lineHeight) || anyPatch.lineHeight < 0.7 || anyPatch.lineHeight > 3)) {
    return false;
  }
  if ("letterSpacing" in anyPatch && (typeof anyPatch.letterSpacing !== "number" || !Number.isFinite(anyPatch.letterSpacing) || anyPatch.letterSpacing < -20 || anyPatch.letterSpacing > 100)) {
    return false;
  }
  if ("strokeWidth" in anyPatch && (typeof anyPatch.strokeWidth !== "number" || !Number.isFinite(anyPatch.strokeWidth) || anyPatch.strokeWidth < 0)) {
    return false;
  }
  if ("radius" in anyPatch && (typeof anyPatch.radius !== "number" || !Number.isFinite(anyPatch.radius) || anyPatch.radius < 0)) {
    return false;
  }
  return true;
}

export function patchLayer(
  slide: SlideDocument,
  layerId: string,
  patch: Partial<Layer>,
): LayerOperationResult {
  if (!isLayerPatchValid(patch)) {
    return { slide, changed: false };
  }
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
