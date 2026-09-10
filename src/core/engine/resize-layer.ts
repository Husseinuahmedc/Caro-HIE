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
  rotation?: number;
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

  let { x, y, width, height } = rectangle;
  width = Math.max(MIN_LAYER_SIZE, width);
  height = Math.max(MIN_LAYER_SIZE, height);

  if (!context.layer.rotation) {
    x = clampNumber(x, 0, Math.max(0, container.width - MIN_LAYER_SIZE));
    y = clampNumber(y, 0, Math.max(0, container.height - MIN_LAYER_SIZE));
    width = clampNumber(width, MIN_LAYER_SIZE, Math.max(MIN_LAYER_SIZE, container.width - x));
    height = clampNumber(height, MIN_LAYER_SIZE, Math.max(MIN_LAYER_SIZE, container.height - y));
  }

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
  const rotation = source.rotation ?? 0;
  if (!rotation) {
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
    return { x, y, width, height, rotation: 0 };
  }

  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const deltaU = deltaX * cos + deltaY * sin;
  const deltaV = -deltaX * sin + deltaY * cos;

  const w0 = source.width;
  const h0 = source.height;
  const c0x = source.x + w0 / 2;
  const c0y = source.y + h0 / 2;

  let w = w0;
  let h = h0;

  if (handle.includes("e")) w = Math.max(MIN_LAYER_SIZE, w0 + deltaU);
  if (handle.includes("w")) w = Math.max(MIN_LAYER_SIZE, w0 - deltaU);
  if (handle.includes("s")) h = Math.max(MIN_LAYER_SIZE, h0 + deltaV);
  if (handle.includes("n")) h = Math.max(MIN_LAYER_SIZE, h0 - deltaV);

  const uAnc0 = handle.includes("e") ? 0 : handle.includes("w") ? w0 : w0 / 2;
  const vAnc0 = handle.includes("s") ? 0 : handle.includes("n") ? h0 : h0 / 2;

  const dAnc0U = uAnc0 - w0 / 2;
  const dAnc0V = vAnc0 - h0 / 2;

  const anchorX = c0x + dAnc0U * cos - dAnc0V * sin;
  const anchorY = c0y + dAnc0U * sin + dAnc0V * cos;

  const uAncNew = handle.includes("e") ? 0 : handle.includes("w") ? w : w / 2;
  const vAncNew = handle.includes("s") ? 0 : handle.includes("n") ? h : h / 2;

  const dAncNewU = uAncNew - w / 2;
  const dAncNewV = vAncNew - h / 2;

  const cNewX = anchorX - (dAncNewU * cos - dAncNewV * sin);
  const cNewY = anchorY - (dAncNewU * sin + dAncNewV * cos);

  return {
    x: cNewX - w / 2,
    y: cNewY - h / 2,
    width: w,
    height: h,
    rotation,
  };
}
