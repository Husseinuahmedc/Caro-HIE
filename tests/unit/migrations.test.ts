import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION, UnsupportedDocumentVersionError, migrateProjectDocument } from "@/core/document";

describe("document migrations", () => {
  it("migrates a legacy v1 project and extracts embedded images", () => {
    const result = migrateProjectDocument({
      id: "legacy",
      name: "Legacy",
      frame: "portrait",
      slides: [{ id: "slide", name: "Cover", role: "cover", layers: [{ id: "image", type: "image", name: "Photo", x: 0, y: 0, width: 200, height: 200, src: "data:image/png;base64,AA==" }] }],
    });
    expect(result.migratedFrom).toBe(1);
    expect(result.document.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(result.document.framePresetId).toBe("portrait");
    expect(result.extractedAssets).toHaveLength(1);
    expect(result.document.slides[0]?.layers[0]).toMatchObject({ type: "image", assetId: result.extractedAssets[0]?.id });
  });

  it("rejects documents from a newer app", () => {
    expect(() => migrateProjectDocument({ schemaVersion: 99 })).toThrow(UnsupportedDocumentVersionError);
  });
});
