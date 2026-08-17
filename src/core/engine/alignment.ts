import { getFramePreset, type FramePresetId, type Layer, type SlideDocument } from "../document";
import { getSelectionBounds } from "./bounds";
import type { LayerOperationResult } from "./operation-result";

export type AlignmentMode = "left" | "center-x" | "right" | "top" | "center-y" | "bottom";
export type DistributionMode = "horizontal" | "vertical";

function alignedPosition(layer: Layer, mode: AlignmentMode, target: { x: number; y: number; width: number; height: number }) {
  if (mode === "left") return { x: target.x, y: layer.y };
  if (mode === "center-x") return { x: target.x + (target.width - layer.width) / 2, y: layer.y };
  if (mode === "right") return { x: target.x + target.width - layer.width, y: layer.y };
  if (mode === "top") return { x: layer.x, y: target.y };
  if (mode === "center-y") return { x: layer.x, y: target.y + (target.height - layer.height) / 2 };
  return { x: layer.x, y: target.y + target.height - layer.height };
}

export function alignLayers(
  slide: SlideDocument,
  layerIds: string[],
  mode: AlignmentMode,
  framePresetId: FramePresetId,
): LayerOperationResult {
  const selectedIds = new Set(layerIds);
  const selected = slide.layers.filter((layer) => selectedIds.has(layer.id) && !layer.locked);
  if (!selected.length) return { slide, changed: false };
  const selectionBounds = getSelectionBounds(slide, selected.map((layer) => layer.id));
  const frame = getFramePreset(framePresetId);
  const target =
    selected.length === 1
      ? { x: 0, y: 0, width: frame.width, height: frame.height }
      : selectionBounds;
  if (!target) return { slide, changed: false };
  return {
    slide: {
      ...slide,
      layers: slide.layers.map((layer) => {
        if (!selectedIds.has(layer.id) || layer.locked) return layer;
        return { ...layer, ...alignedPosition(layer, mode, target) };
      }),
    },
    changed: true,
  };
}

export function distributeLayers(
  slide: SlideDocument,
  layerIds: string[],
  mode: DistributionMode,
): LayerOperationResult {
  const selectedIds = new Set(layerIds);
  const selected = slide.layers
    .filter((layer) => selectedIds.has(layer.id) && !layer.locked)
    .sort((a, b) => (mode === "horizontal" ? a.x - b.x : a.y - b.y));
  if (selected.length < 3) return { slide, changed: false };
  const first = selected[0];
  const last = selected.at(-1);
  if (!first || !last) return { slide, changed: false };
  const occupied = selected.reduce(
    (sum, layer) => sum + (mode === "horizontal" ? layer.width : layer.height),
    0,
  );
  const span =
    mode === "horizontal"
      ? last.x + last.width - first.x
      : last.y + last.height - first.y;
  const gap = (span - occupied) / (selected.length - 1);
  const positions = new Map<string, number>();
  let cursor = mode === "horizontal" ? first.x : first.y;
  for (const layer of selected) {
    positions.set(layer.id, cursor);
    cursor += (mode === "horizontal" ? layer.width : layer.height) + gap;
  }
  return {
    slide: {
      ...slide,
      layers: slide.layers.map((layer) => {
        const position = positions.get(layer.id);
        if (position === undefined) return layer;
        return mode === "horizontal" ? { ...layer, x: position } : { ...layer, y: position };
      }),
    },
    changed: true,
  };
}
