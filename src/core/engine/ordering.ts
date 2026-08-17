import type { SlideDocument } from "../document";
import { findLayerContext, updateLayerCollection } from "./layer-tree";
import type { LayerOperationResult } from "./operation-result";

export type LayerOrderDirection = "forward" | "backward";
export type LayerOrderEdge = "front" | "back";

export function reorderLayer(
  slide: SlideDocument,
  layerId: string,
  direction: LayerOrderDirection,
): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.layer.locked || context.parentLocked) return { slide, changed: false };
  let changed = false;
  const layers = updateLayerCollection(slide.layers, layerId, (collection, index) => {
    const target = direction === "forward" ? index + 1 : index - 1;
    if (target < 0 || target >= collection.length) return collection;
    const next = [...collection];
    [next[index], next[target]] = [next[target], next[index]];
    changed = true;
    return next;
  });
  return changed ? { slide: { ...slide, layers }, changed: true } : { slide, changed: false };
}

export function moveLayerToEdge(
  slide: SlideDocument,
  layerId: string,
  edge: LayerOrderEdge,
): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.layer.locked || context.parentLocked) return { slide, changed: false };
  let changed = false;
  const layers = updateLayerCollection(slide.layers, layerId, (collection, index) => {
    if ((edge === "front" && index === collection.length - 1) || (edge === "back" && index === 0)) {
      return collection;
    }
    const next = [...collection];
    const [layer] = next.splice(index, 1);
    if (!layer) return collection;
    if (edge === "front") next.push(layer);
    else next.unshift(layer);
    changed = true;
    return next;
  });
  return changed ? { slide: { ...slide, layers }, changed: true } : { slide, changed: false };
}
