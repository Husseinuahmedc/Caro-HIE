import { getFramePreset, type FramePresetId, type SlideDocument } from "../document";
import { getSelectionBounds } from "./bounds";
import { updateLayerInTree } from "./layer-tree";
import { clampNumber } from "./numbers";
import type { PointDelta } from "./move-layer";
import type { LayerOperationResult } from "./operation-result";

export function moveSelectedLayers(
  slide: SlideDocument,
  layerIds: string[],
  delta: PointDelta,
  framePresetId: FramePresetId,
): LayerOperationResult {
  const topLevelIds = layerIds.filter((id) => slide.layers.some((layer) => layer.id === id && !layer.locked));
  const bounds = getSelectionBounds(slide, topLevelIds);
  if (!bounds || !topLevelIds.length) return { slide, changed: false };
  const frame = getFramePreset(framePresetId);
  const dx = clampNumber(delta.x, -bounds.x, frame.width - (bounds.x + bounds.width));
  const dy = clampNumber(delta.y, -bounds.y, frame.height - (bounds.y + bounds.height));
  if (dx === 0 && dy === 0) return { slide, changed: false };
  const selected = new Set(topLevelIds);
  return {
    slide: {
      ...slide,
      layers: slide.layers.map((layer) =>
        selected.has(layer.id) ? { ...layer, x: layer.x + dx, y: layer.y + dy } : layer,
      ),
    },
    changed: true,
  };
}

export function translateLayerWithoutClamping(
  slide: SlideDocument,
  layerId: string,
  delta: PointDelta,
): SlideDocument {
  return {
    ...slide,
    layers: updateLayerInTree(slide.layers, layerId, (layer) => ({
      ...layer,
      x: layer.x + delta.x,
      y: layer.y + delta.y,
    })),
  };
}
