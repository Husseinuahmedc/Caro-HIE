import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  UnsupportedDocumentVersionError,
  createBlankProjectDocument,
  createCodeLayer,
  createIconLayer,
  migrateProjectDocument,
} from "@/core/document";

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

  it("adds code and icon controls when migrating a v3 project", () => {
    const current = createBlankProjectDocument();
    current.slides[0]!.layers.push(createCodeLayer(), createIconLayer());
    const legacy = structuredClone(current) as unknown as {
      schemaVersion: number;
      slides: Array<{ layers: Array<Record<string, unknown>> }>;
    };
    legacy.schemaVersion = 3;
    for (const layer of legacy.slides[0]!.layers) {
      if (layer.type === "code") {
        delete layer.theme;
        delete layer.showLineNumbers;
        delete layer.highlightedLines;
      }
      if (layer.type === "icon") {
        layer.icon = "✦";
        delete layer.fill;
        delete layer.strokeWidth;
      }
    }

    const result = migrateProjectDocument(legacy);
    const code = result.document.slides[0]?.layers.find((layer) => layer.type === "code");
    const icon = result.document.slides[0]?.layers.find((layer) => layer.type === "icon");

    expect(code).toMatchObject({ theme: "sand", showLineNumbers: true, highlightedLines: [] });
    expect(icon).toMatchObject({ icon: "sparkles", fill: "none", strokeWidth: 2 });
  });
});
