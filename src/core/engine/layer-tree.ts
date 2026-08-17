import type { GroupLayer, Layer } from "../document";

export interface LayerContext {
  layer: Layer;
  parent: GroupLayer | null;
  parentLocked: boolean;
  absoluteX: number;
  absoluteY: number;
}

export function findLayerContext(
  layers: Layer[],
  layerId: string,
  parent: GroupLayer | null = null,
  offsetX = 0,
  offsetY = 0,
  parentLocked = false,
): LayerContext | null {
  for (const layer of layers) {
    const absoluteX = offsetX + layer.x;
    const absoluteY = offsetY + layer.y;
    if (layer.id === layerId) {
      return { layer, parent, parentLocked, absoluteX, absoluteY };
    }
    if (layer.type === "group") {
      const nested = findLayerContext(
        layer.children,
        layerId,
        layer,
        absoluteX,
        absoluteY,
        parentLocked || layer.locked,
      );
      if (nested) return nested;
    }
  }
  return null;
}

export function updateLayerInTree(
  layers: Layer[],
  layerId: string,
  update: (layer: Layer) => Layer,
): Layer[] {
  return layers.map((layer) => {
    if (layer.id === layerId) return update(layer);
    if (layer.type === "group") {
      return { ...layer, children: updateLayerInTree(layer.children, layerId, update) };
    }
    return layer;
  });
}

export function updateLayerCollection(
  layers: Layer[],
  layerId: string,
  update: (collection: Layer[], index: number) => Layer[],
): Layer[] {
  const index = layers.findIndex((layer) => layer.id === layerId);
  if (index >= 0) return update(layers, index);
  return layers.map((layer) =>
    layer.type === "group"
      ? { ...layer, children: updateLayerCollection(layer.children, layerId, update) }
      : layer,
  );
}

export function layerExists(layers: Layer[], layerId: string): boolean {
  return findLayerContext(layers, layerId) !== null;
}
