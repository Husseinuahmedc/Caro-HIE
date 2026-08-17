import { describe, expect, it } from "vitest";

import { calculateInitialCanvasZoom } from "@/editor/hooks/use-initial-canvas-zoom";

describe("initial editor zoom", () => {
  it("fits the fixed frame inside a mobile viewport", () => {
    expect(calculateInitialCanvasZoom(390, 1080)).toBeCloseTo(326 / 1080);
  });

  it("keeps the preferred desktop zoom when space allows", () => {
    expect(calculateInitialCanvasZoom(1440, 1080)).toBe(0.55);
  });

  it("does not go below the editor minimum", () => {
    expect(calculateInitialCanvasZoom(260, 1080)).toBe(0.2);
  });
});
