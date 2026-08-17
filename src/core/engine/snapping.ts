import { getFramePreset, type FramePresetId, type Layer, type SlideDocument } from "../document";

export interface SnapGuide {
  axis: "x" | "y";
  value: number;
  kind: "frame" | "layer";
}

export interface SnappedPosition {
  x: number;
  y: number;
  guides: SnapGuide[];
}

interface Anchor {
  position: number;
  guide: number;
  kind: SnapGuide["kind"];
}

function closestSnap(
  movingAnchors: { position: number; offset: number }[],
  targets: Anchor[],
  threshold: number,
) {
  let best: { delta: number; guide: number; kind: SnapGuide["kind"] } | null = null;
  for (const moving of movingAnchors) {
    for (const target of targets) {
      const delta = target.position - moving.position;
      if (Math.abs(delta) > threshold || (best && Math.abs(delta) >= Math.abs(best.delta))) continue;
      best = { delta, guide: target.guide, kind: target.kind };
    }
  }
  return best;
}

function layerAnchors(layer: Layer) {
  return {
    x: [
      { position: layer.x, offset: 0 },
      { position: layer.x + layer.width / 2, offset: layer.width / 2 },
      { position: layer.x + layer.width, offset: layer.width },
    ],
    y: [
      { position: layer.y, offset: 0 },
      { position: layer.y + layer.height / 2, offset: layer.height / 2 },
      { position: layer.y + layer.height, offset: layer.height },
    ],
  };
}

export function snapLayerPosition(
  proposedLayer: Layer,
  slide: SlideDocument,
  framePresetId: FramePresetId,
  threshold = 14,
  ignoredLayerIds: string[] = [proposedLayer.id],
): SnappedPosition {
  const frame = getFramePreset(framePresetId);
  const ignored = new Set(ignoredLayerIds);
  const xTargets: Anchor[] = [0, frame.width / 2, frame.width].map((position) => ({
    position,
    guide: position,
    kind: "frame",
  }));
  const yTargets: Anchor[] = [0, frame.height / 2, frame.height].map((position) => ({
    position,
    guide: position,
    kind: "frame",
  }));
  for (const layer of slide.layers) {
    if (ignored.has(layer.id) || !layer.visible) continue;
    xTargets.push(
      { position: layer.x, guide: layer.x, kind: "layer" },
      { position: layer.x + layer.width / 2, guide: layer.x + layer.width / 2, kind: "layer" },
      { position: layer.x + layer.width, guide: layer.x + layer.width, kind: "layer" },
    );
    yTargets.push(
      { position: layer.y, guide: layer.y, kind: "layer" },
      { position: layer.y + layer.height / 2, guide: layer.y + layer.height / 2, kind: "layer" },
      { position: layer.y + layer.height, guide: layer.y + layer.height, kind: "layer" },
    );
  }
  const anchors = layerAnchors(proposedLayer);
  const snapX = closestSnap(anchors.x, xTargets, threshold);
  const snapY = closestSnap(anchors.y, yTargets, threshold);
  return {
    x: proposedLayer.x + (snapX?.delta ?? 0),
    y: proposedLayer.y + (snapY?.delta ?? 0),
    guides: [
      ...(snapX ? [{ axis: "x" as const, value: snapX.guide, kind: snapX.kind }] : []),
      ...(snapY ? [{ axis: "y" as const, value: snapY.guide, kind: snapY.kind }] : []),
    ],
  };
}
