import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { createShapeLayer, createTextLayer, type SlideDocument } from "@/core/document";
import { patchLayer } from "@/core/engine";
import { DocumentValidationError, normalizeStorageError } from "@/storage";

function slideWith(...layers: SlideDocument["layers"]): SlideDocument {
  return { id: "slide-test", name: "Slide", layers };
}

describe("number field and layer patch validation", () => {
  it("rejects negative or zero width in patchLayer without mutating slide", () => {
    const layer = createShapeLayer({ width: 200, height: 100 });
    const slide = slideWith(layer);

    const resNegative = patchLayer(slide, layer.id, { width: -50 });
    expect(resNegative.changed).toBe(false);
    expect(resNegative.slide.layers[0]?.width).toBe(200);

    const resZero = patchLayer(slide, layer.id, { width: 0 });
    expect(resZero.changed).toBe(false);
    expect(resZero.slide.layers[0]?.width).toBe(200);
  });

  it("rejects negative or zero height in patchLayer without mutating slide", () => {
    const layer = createShapeLayer({ width: 200, height: 100 });
    const slide = slideWith(layer);

    const resNegative = patchLayer(slide, layer.id, { height: -20 });
    expect(resNegative.changed).toBe(false);
    expect(resNegative.slide.layers[0]?.height).toBe(100);

    const resZero = patchLayer(slide, layer.id, { height: 0 });
    expect(resZero.changed).toBe(false);
    expect(resZero.slide.layers[0]?.height).toBe(100);
  });

  it("rejects non-finite values (NaN, Infinity) in coordinates and dimensions", () => {
    const layer = createShapeLayer();
    const slide = slideWith(layer);

    expect(patchLayer(slide, layer.id, { width: Number.NaN }).changed).toBe(false);
    expect(patchLayer(slide, layer.id, { x: Number.POSITIVE_INFINITY }).changed).toBe(false);
    expect(patchLayer(slide, layer.id, { rotation: Number.NaN }).changed).toBe(false);
  });

  it("rejects opacity outside [0, 1]", () => {
    const layer = createShapeLayer();
    const slide = slideWith(layer);

    expect(patchLayer(slide, layer.id, { opacity: -0.1 }).changed).toBe(false);
    expect(patchLayer(slide, layer.id, { opacity: 1.5 }).changed).toBe(false);
  });

  it("accepts valid modifications including negative coordinates and rotation", () => {
    const layer = createTextLayer({ x: 100, y: 100, width: 200, height: 80, rotation: 0, opacity: 1 });
    const slide = slideWith(layer);

    // Negative coordinates and rotation are valid geometric states
    const res = patchLayer(slide, layer.id, {
      x: -40,
      y: -10,
      rotation: -45,
      opacity: 0.75,
      width: 320,
      height: 120,
    });

    expect(res.changed).toBe(true);
    expect(res.slide.layers[0]).toMatchObject({
      x: -40,
      y: -10,
      rotation: -45,
      opacity: 0.75,
      width: 320,
      height: 120,
    });
  });

  it("normalizes validation errors with clear Arabic message instead of storage failure", () => {
    const docError = new DocumentValidationError("قيمة غير صالحة");
    const normalizedDoc = normalizeStorageError(docError);
    expect(normalizedDoc).toBeInstanceOf(DocumentValidationError);
    expect(normalizedDoc.message).toBe("قيمة غير صالحة");

    const zodError = new ZodError([
      {
        origin: "number",
        code: "too_small",
        minimum: 1,
        inclusive: true,
        exact: false,
        message: "Number must be greater than 0",
        path: ["slides", 0, "layers", 0, "width"],
      },
    ]);
    const normalizedZod = normalizeStorageError(zodError);
    expect(normalizedZod).toBeInstanceOf(DocumentValidationError);
    expect(normalizedZod.message).toContain("بيانات المستند غير صالحة");
    expect(normalizedZod.message).not.toBe("تعذر الوصول إلى التخزين المحلي.");
  });
});
