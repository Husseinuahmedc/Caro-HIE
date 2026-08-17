import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  MAX_SLIDES,
  createBlankProjectDocument,
  createDocumentId,
  parseProjectDocument,
  validateProjectDocument,
} from "@/core/document";

describe("ProjectDocument validation", () => {
  it("accepts a valid current document", () => {
    expect(parseProjectDocument(createBlankProjectDocument()).schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });

  it("rejects more than nine slides", () => {
    const document = createBlankProjectDocument();
    document.slides = Array.from({ length: MAX_SLIDES + 1 }, (_, index) => ({ id: createDocumentId("slide"), name: `Slide ${index}`, layers: [] }));
    expect(validateProjectDocument(document).success).toBe(false);
  });

  it("rejects base64 image data in place of an asset id", () => {
    const document = createBlankProjectDocument() as unknown as Record<string, unknown>;
    const firstSlide = (document.slides as Array<Record<string, unknown>>)[0];
    firstSlide!.layers = [{ id: "image", name: "Image", type: "image", x: 0, y: 0, width: 100, height: 100, rotation: 0, opacity: 1, visible: true, locked: false, src: "data:image/png;base64,AA==", alt: "", fit: "cover", radius: 0 }];
    expect(validateProjectDocument(document).success).toBe(false);
  });
});
