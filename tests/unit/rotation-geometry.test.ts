import { describe, expect, it } from "vitest";

import { createShapeLayer, type SlideDocument } from "@/core/document";
import { getLayerAabb, getOrientedLayerBounds, getTransformedCorners, rectangleFromResizeDelta } from "@/core/engine";
import { runPreflight } from "@/core/preflight";
import { arabicCoverFixture } from "../fixtures/project-fixtures";

function slideWith(...layers: SlideDocument["layers"]): SlideDocument {
  return { id: "slide-test", name: "Slide", layers };
}

describe("rotation geometry and bounds", () => {
  it("calculates exact AABB for 0-degree layer", () => {
    const layer = createShapeLayer({ x: 100, y: 150, width: 200, height: 100, rotation: 0 });
    const slide = slideWith(layer);
    const oriented = getOrientedLayerBounds(slide, layer.id)!;
    expect(oriented).toMatchObject({ x: 100, y: 150, width: 200, height: 100, rotation: 0, centerX: 200, centerY: 200 });

    const aabb = getLayerAabb(slide, layer.id)!;
    expect(aabb).not.toBeNull();
    expect(aabb.x).toBe(100);
    expect(aabb.y).toBe(150);
    expect(aabb.width).toBe(200);
    expect(aabb.height).toBe(100);
  });

  it("calculates exact AABB for 90-degree layer (swapping extents around center)", () => {
    // Center is (100 + 100, 100 + 50) = (200, 150)
    // At 90 deg, rotated width is 100, rotated height is 200
    // minX = 200 - 50 = 150, maxX = 200 + 50 = 250
    // minY = 150 - 100 = 50, maxY = 150 + 100 = 250
    const layer = createShapeLayer({ x: 100, y: 100, width: 200, height: 100, rotation: 90 });
    const slide = slideWith(layer);
    const aabb = getLayerAabb(slide, layer.id)!;
    expect(aabb).not.toBeNull();
    expect(Math.round(aabb.x)).toBe(150);
    expect(Math.round(aabb.y)).toBe(50);
    expect(Math.round(aabb.width)).toBe(100);
    expect(Math.round(aabb.height)).toBe(200);
  });

  it("calculates AABB for 45-degree 840x480 shape at (120, 120) demonstrating frame overflow", () => {
    const layer = createShapeLayer({ x: 120, y: 120, width: 840, height: 480, rotation: 45 });
    const slide = slideWith(layer);
    const aabb = getLayerAabb(slide, layer.id)!;
    expect(aabb).not.toBeNull();

    // Center is at (120 + 420, 120 + 240) = (540, 360)
    // Extents: (840 * cos45 + 480 * sin45) = 1320 / sqrt(2) ≈ 933.38
    // minY = 360 - (933.38 / 2) ≈ -106.69 (overflows frame top 0!)
    expect(aabb.y).toBeLessThan(0);
    expect(aabb.width).toBeGreaterThan(900);
    expect(aabb.height).toBeGreaterThan(900);
  });

  it("anchors opposite corner in world space during rotated resize", () => {
    // Create a 200x200 square at (100, 100) rotated 45 degrees
    const layer = createShapeLayer({ x: 100, y: 100, width: 200, height: 200, rotation: 45 });
    const initialCorners = getTransformedCorners(layer.x, layer.y, layer.width, layer.height, layer.rotation);
    const initialNw = initialCorners[0]!;

    // Drag the southeast (se) handle
    const resized = rectangleFromResizeDelta(layer, "se", 50, 50);
    const updatedCorners = getTransformedCorners(resized.x, resized.y, resized.width, resized.height, resized.rotation ?? layer.rotation);
    const updatedNw = updatedCorners[0]!;

    // NW corner in world coordinates must remain stationary
    expect(Math.round(updatedNw.x)).toBe(Math.round(initialNw.x));
    expect(Math.round(updatedNw.y)).toBe(Math.round(initialNw.y));
  });

  it("detects preflight overflow for rotated shapes that extend outside frame", () => {
    const doc = structuredClone(arabicCoverFixture);
    const slide = doc.slides[0]!;

    // An 840x480 shape at (120, 120) with rotation 0 does NOT overflow a 1080x1080 square frame
    slide.layers = [
      createShapeLayer({ id: "shape-unrotated", x: 120, y: 120, width: 840, height: 480, rotation: 0 }),
    ];
    let issues = runPreflight(doc);
    expect(issues.some((i) => i.ruleId === "overflow" && i.target?.layerId === "shape-unrotated")).toBe(false);

    // When rotated 45 degrees, it extends outside the top (minY < 0), so preflight MUST flag it
    slide.layers = [
      createShapeLayer({ id: "shape-rotated", x: 120, y: 120, width: 840, height: 480, rotation: 45 }),
    ];
    issues = runPreflight(doc);
    const overflowIssue = issues.find((i) => i.ruleId === "overflow" && i.target?.layerId === "shape-rotated");
    expect(overflowIssue).toBeDefined();
    expect(overflowIssue?.severity).toBe("error");
  });
});
