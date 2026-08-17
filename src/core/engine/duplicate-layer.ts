import {
  createDocumentId,
  getFramePreset,
  type FramePresetId,
  type Layer,
  type SlideDocument,
} from "../document";
import { findLayerContext, updateLayerCollection } from "./layer-tree";
import { clampNumber } from "./numbers";
import type { IdentifiedLayerOperationResult } from "./operation-result";

function copyLayerWithNewIds(layer: Layer): Layer {
  const copied = structuredClone(layer);
  copied.id = createDocumentId(layer.type);
  copied.name = `${layer.name} — نسخة`;
  if (copied.type === "group") copied.children = copied.children.map(copyLayerWithNewIds);
  return copied;
}

export function duplicateLayer(
  slide: SlideDocument,
  layerId: string,
  framePresetId: FramePresetId,
): IdentifiedLayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context) return { slide, changed: false, layerId: null };
  const duplicate = copyLayerWithNewIds(context.layer);
  const container = context.parent ?? getFramePreset(framePresetId);
  duplicate.x = clampNumber(context.layer.x + 28, 0, Math.max(0, container.width - duplicate.width));
  duplicate.y = clampNumber(context.layer.y + 28, 0, Math.max(0, container.height - duplicate.height));
  let changed = false;
  const layers = updateLayerCollection(slide.layers, layerId, (collection, index) => {
    const next = [...collection];
    next.splice(index + 1, 0, duplicate);
    changed = true;
    return next;
  });
  return changed
    ? { slide: { ...slide, layers }, changed: true, layerId: duplicate.id }
    : { slide, changed: false, layerId: null };
}
