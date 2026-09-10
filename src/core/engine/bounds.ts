import { getFramePreset, type FramePreset, type Layer, type SlideDocument } from "../document";
import { findLayerContext } from "./layer-tree";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface OrientedBounds extends Bounds {
  rotation: number;
  centerX: number;
  centerY: number;
}

export function getTransformedCorners(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
): [Point, Point, Point, Point] {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = x + width / 2;
  const cy = y + height / 2;
  const halfW = width / 2;
  const halfH = height / 2;

  const offsets = [
    { dx: -halfW, dy: -halfH },
    { dx: halfW, dy: -halfH },
    { dx: halfW, dy: halfH },
    { dx: -halfW, dy: halfH },
  ];

  return offsets.map(({ dx, dy }) => ({
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  })) as [Point, Point, Point, Point];
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

export function getOrientedLayerBounds(slide: SlideDocument, layerId: string): OrientedBounds | null {
  const context = findLayerContext(slide.layers, layerId);
  if (!context) return null;
  return {
    x: context.absoluteX,
    y: context.absoluteY,
    width: context.layer.width,
    height: context.layer.height,
    rotation: context.layer.rotation,
    centerX: context.absoluteX + context.layer.width / 2,
    centerY: context.absoluteY + context.layer.height / 2,
  };
}

export function getLayerAabb(slide: SlideDocument, layerId: string): Bounds | null {
  const context = findLayerContext(slide.layers, layerId);
  if (!context) return null;
  const { layer } = context;
  if (!layer.rotation) {
    return {
      x: context.absoluteX,
      y: context.absoluteY,
      width: layer.width,
      height: layer.height,
    };
  }
  const corners = getTransformedCorners(
    context.absoluteX,
    context.absoluteY,
    layer.width,
    layer.height,
    layer.rotation,
  );
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function getSelectionBounds(slide: SlideDocument, layerIds: string[]): Bounds | null {
  const bounds = layerIds
    .map((id) => getLayerAabb(slide, id) ?? getAbsoluteLayerBounds(slide, id))
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
  if (!layer.rotation) {
    return (
      layer.x >= 0 &&
      layer.y >= 0 &&
      layer.x + layer.width <= preset.width &&
      layer.y + layer.height <= preset.height
    );
  }
  const corners = getTransformedCorners(layer.x, layer.y, layer.width, layer.height, layer.rotation);
  return corners.every(
    (p) => p.x >= 0 && p.y >= 0 && p.x <= preset.width && p.y <= preset.height,
  );
}
