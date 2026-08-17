import { getFramePreset, type FramePresetId, type SlideDocument } from "../document";
import { findLayerContext, updateLayerInTree } from "./layer-tree";
import { clampNumber } from "./numbers";
import type { LayerOperationResult } from "./operation-result";

export interface PointDelta {
  x: number;
  y: number;
}

export function moveLayer(
  slide: SlideDocument,
  layerId: string,
  delta: PointDelta,
  framePresetId: FramePresetId,
): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.layer.locked || context.parentLocked) return { slide, changed: false };
  const container = context.parent ?? getFramePreset(framePresetId);
  const nextX = clampNumber(
    context.layer.x + delta.x,
    0,
    Math.max(0, container.width - context.layer.width),
  );
  const nextY = clampNumber(
    context.layer.y + delta.y,
    0,
    Math.max(0, container.height - context.layer.height),
  );
  if (nextX === context.layer.x && nextY === context.layer.y) return { slide, changed: false };
  return {
    slide: {
      ...slide,
      layers: updateLayerInTree(slide.layers, layerId, (layer) => ({
        ...layer,
        x: nextX,
        y: nextY,
      })),
    },
    changed: true,
  };
}
