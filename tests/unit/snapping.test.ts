import { describe, expect, it } from "vitest";

import { createShapeLayer, type SlideDocument } from "@/core/document";
import { snapLayerPosition } from "@/core/engine";

describe("snapping", () => {
  it("snaps a center to the frame center", () => {
    const moving = createShapeLayer({ id: "moving", x: 431, y: 200, width: 200, height: 100 });
    const slide: SlideDocument = { id: "slide", name: "Slide", layers: [moving] };
    const result = snapLayerPosition(moving, slide, "square", 12);
    expect(result.x).toBe(440);
    expect(result.guides).toContainEqual({ axis: "x", value: 540, kind: "frame" });
  });

  it("snaps to another layer edge", () => {
    const target = createShapeLayer({ id: "target", x: 100, y: 100, width: 200, height: 200 });
    const moving = createShapeLayer({ id: "moving", x: 306, y: 400, width: 100, height: 100 });
    const result = snapLayerPosition(moving, { id: "slide", name: "Slide", layers: [target, moving] }, "square", 10);
    expect(result.x).toBe(300);
    expect(result.guides.some((guide) => guide.kind === "layer")).toBe(true);
  });
});
