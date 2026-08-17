import { createDocumentId, type GroupLayer, type SlideDocument } from "../document";
import type { IdentifiedLayerOperationResult, LayerOperationResult } from "./operation-result";

export function groupLayers(
  slide: SlideDocument,
  layerIds: string[],
): IdentifiedLayerOperationResult {
  const ids = new Set(layerIds);
  const selected = slide.layers.filter((layer) => ids.has(layer.id) && !layer.locked);
  if (selected.length < 2) return { slide, changed: false, layerId: null };

  const left = Math.min(...selected.map((layer) => layer.x));
  const top = Math.min(...selected.map((layer) => layer.y));
  const right = Math.max(...selected.map((layer) => layer.x + layer.width));
  const bottom = Math.max(...selected.map((layer) => layer.y + layer.height));
  const firstIndex = Math.min(...selected.map((layer) => slide.layers.indexOf(layer)));
  const group: GroupLayer = {
    id: createDocumentId("group"),
    type: "group",
    name: "مجموعة",
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    children: selected.map((layer) => ({ ...layer, x: layer.x - left, y: layer.y - top })),
  };
  const remaining = slide.layers.filter((layer) => !ids.has(layer.id));
  remaining.splice(firstIndex, 0, group);
  return { slide: { ...slide, layers: remaining }, changed: true, layerId: group.id };
}

export function ungroupLayer(slide: SlideDocument, groupId: string): LayerOperationResult {
  const index = slide.layers.findIndex((layer) => layer.id === groupId);
  const group = slide.layers[index];
  if (!group || group.type !== "group" || group.locked) return { slide, changed: false };
  const children = group.children.map((child) => ({
    ...child,
    x: child.x + group.x,
    y: child.y + group.y,
    opacity: child.opacity * group.opacity,
  }));
  const layers = [...slide.layers];
  layers.splice(index, 1, ...children);
  return { slide: { ...slide, layers }, changed: true };
}
