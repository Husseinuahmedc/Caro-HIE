import { getFramePreset, type FramePreset, type Layer, type SlideDocument } from "../document";
import { findLayerContext } from "./layer-tree";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getAbsoluteLayerBounds(slide: SlideDocument, layerId: string): Bounds | null {
  const context = findLayerContext(slide.layers, layerId);
  if (!context) return null;
  return {
    x: context.absoluteX,
    y: context.absoluteY,
    width: context.layer.width,
    height: context.layer.height,
  };
}

export function getSelectionBounds(slide: SlideDocument, layerIds: string[]): Bounds | null {
  const bounds = layerIds
    .map((id) => getAbsoluteLayerBounds(slide, id))
    .filter((entry): entry is Bounds => entry !== null);
  if (!bounds.length) return null;
  const left = Math.min(...bounds.map((entry) => entry.x));
  const top = Math.min(...bounds.map((entry) => entry.y));
  const right = Math.max(...bounds.map((entry) => entry.x + entry.width));
  const bottom = Math.max(...bounds.map((entry) => entry.y + entry.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function isLayerInsideFrame(
  layer: Layer,
  frame: FramePreset | Parameters<typeof getFramePreset>[0],
): boolean {
  const preset = typeof frame === "string" ? getFramePreset(frame) : frame;
  return (
    layer.x >= 0 &&
    layer.y >= 0 &&
    layer.x + layer.width <= preset.width &&
    layer.y + layer.height <= preset.height
  );
}
