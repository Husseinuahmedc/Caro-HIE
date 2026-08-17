import { describe, expect, it } from "vitest";

import { createShapeLayer, createTextLayer, type SlideDocument } from "@/core/document";
import { findLayerContext, groupLayers, moveLayer, toggleLayerLock, ungroupLayer } from "@/core/engine";

describe("grouping and locking", () => {
  it("round-trips positions through group and ungroup", () => {
    const first = createTextLayer({ id: "first", x: 100, y: 120 });
    const second = createShapeLayer({ id: "second", x: 500, y: 360 });
    const slide: SlideDocument = { id: "slide", name: "Slide", layers: [first, second] };
    const grouped = groupLayers(slide, [first.id, second.id]);
    expect(grouped.layerId).toBeTruthy();
    const restored = ungroupLayer(grouped.slide, grouped.layerId!).slide;
    expect(findLayerContext(restored.layers, first.id)?.layer).toMatchObject({ x: 100, y: 120 });
    expect(findLayerContext(restored.layers, second.id)?.layer).toMatchObject({ x: 500, y: 360 });
  });

  it("prevents moving a locked layer", () => {
    const layer = createTextLayer({ id: "locked", locked: true });
    const slide: SlideDocument = { id: "slide", name: "Slide", layers: [layer] };
    expect(moveLayer(slide, layer.id, { x: 100, y: 100 }, "square").changed).toBe(false);
  });

  it("allows unlocking through the canonical lock operation", () => {
    const layer = createTextLayer({ id: "locked", locked: true });
    const result = toggleLayerLock({ id: "slide", name: "Slide", layers: [layer] }, layer.id);
    expect(result.slide.layers[0]?.locked).toBe(false);
  });
});
