import { describe, expect, it } from "vitest";

import { createShapeLayer, createTextLayer, type SlideDocument } from "@/core/document";
import { alignLayers, moveLayer, rectangleFromResizeDelta, resizeLayer, rotateLayer } from "@/core/engine";

function slideWith(...layers: SlideDocument["layers"]): SlideDocument {
  return { id: "slide", name: "Slide", layers };
}

describe("geometry engine", () => {
  it("clamps movement to the fixed frame", () => {
    const layer = createTextLayer({ x: 10, y: 10, width: 200, height: 100 });
    const moved = moveLayer(slideWith(layer), layer.id, { x: 2_000, y: -500 }, "square").slide.layers[0];
    expect(moved).toMatchObject({ x: 880, y: 0 });
  });

  it("resizes from a north-west handle and enforces minimum size", () => {
    const layer = createShapeLayer({ x: 100, y: 100, width: 300, height: 200 });
    const rectangle = rectangleFromResizeDelta(layer, "nw", 280, 190);
    const resized = resizeLayer(slideWith(layer), layer.id, rectangle, "square").slide.layers[0];
    expect(resized).toMatchObject({ x: 352, y: 252, width: 48, height: 48 });
  });

  it("normalizes rotations", () => {
    const layer = createShapeLayer();
    expect(rotateLayer(slideWith(layer), layer.id, 450).slide.layers[0]?.rotation).toBe(90);
  });

  it("aligns one layer against the frame", () => {
    const layer = createShapeLayer({ width: 200, x: 77 });
    expect(alignLayers(slideWith(layer), [layer.id], "center-x", "square").slide.layers[0]?.x).toBe(440);
  });
});
