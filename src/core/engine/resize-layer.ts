import { getFramePreset, type FramePresetId, type SlideDocument } from "../document";
import { findLayerContext, updateLayerInTree } from "./layer-tree";
import { clampNumber } from "./numbers";
import type { LayerOperationResult } from "./operation-result";

export const MIN_LAYER_SIZE = 48;
export type ResizeHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

export interface LayerRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function resizeLayer(
  slide: SlideDocument,
  layerId: string,
  rectangle: LayerRectangle,
  framePresetId: FramePresetId,
): LayerOperationResult {
  const context = findLayerContext(slide.layers, layerId);
  if (!context || context.layer.locked || context.parentLocked) return { slide, changed: false };
  const container = context.parent ?? getFramePreset(framePresetId);
  const x = clampNumber(rectangle.x, 0, Math.max(0, container.width - MIN_LAYER_SIZE));
  const y = clampNumber(rectangle.y, 0, Math.max(0, container.height - MIN_LAYER_SIZE));
  const width = clampNumber(rectangle.width, MIN_LAYER_SIZE, Math.max(MIN_LAYER_SIZE, container.width - x));
  const height = clampNumber(
    rectangle.height,
    MIN_LAYER_SIZE,
    Math.max(MIN_LAYER_SIZE, container.height - y),
  );
  if (
    x === context.layer.x &&
    y === context.layer.y &&
    width === context.layer.width &&
    height === context.layer.height
  ) {
    return { slide, changed: false };
  }
  return {
    slide: {
      ...slide,
      layers: updateLayerInTree(slide.layers, layerId, (layer) => ({
        ...layer,
        x,
        y,
        width,
        height,
      })),
    },
    changed: true,
  };
}

export function rectangleFromResizeDelta(
  source: LayerRectangle,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
): LayerRectangle {
  let { x, y, width, height } = source;
  if (handle.includes("e")) width = Math.max(MIN_LAYER_SIZE, source.width + deltaX);
  if (handle.includes("w")) {
    width = Math.max(MIN_LAYER_SIZE, source.width - deltaX);
    x = source.x + source.width - width;
  }
  if (handle.includes("s")) height = Math.max(MIN_LAYER_SIZE, source.height + deltaY);
  if (handle.includes("n")) {
    height = Math.max(MIN_LAYER_SIZE, source.height - deltaY);
    y = source.y + source.height - height;
  }
  return { x, y, width, height };
}
