import { describe, expect, it } from "vitest";

import { MAX_SLIDES, validateProjectDocument } from "@/core/document";
import { createDocumentFromTemplate, listTemplates } from "@/core/templates";
import { serializeSlideToSvg } from "@/renderer";
import { runPreflight } from "@/core/preflight";
import { arabicCoverFixture, portraitFixture, storyFixture } from "../fixtures/project-fixtures";

describe("template registry", () => {
  it("starts every template without preflight warnings at every supported size", () => {
    for (const template of listTemplates()) {
      for (const framePresetId of ["square", "portrait", "story"] as const) {
        const document = createDocumentFromTemplate(template.id, {framePresetId});
        expect(runPreflight(document), `${template.id}/${framePresetId}`).toEqual([]);
      }
    }
  });
  it("builds every registered template as a valid bounded document", () => {
    expect(listTemplates()).toHaveLength(5);
    for (const template of listTemplates()) {
      const document = createDocumentFromTemplate(template.id);
      expect(validateProjectDocument(document).success).toBe(true);
      expect(document.slides.length).toBeLessThanOrEqual(MAX_SLIDES);
    }
  });

  it("preserves square, portrait, and story presets", () => {
    expect([arabicCoverFixture.framePresetId, portraitFixture.framePresetId, storyFixture.framePresetId]).toEqual(["square", "portrait", "story"]);
  });
});

describe("canonical SVG renderer", () => {
  it("uses native SVG text and excludes editor overlays", () => {
    const slide = arabicCoverFixture.slides[0]!;
    const svg = serializeSlideToSvg(arabicCoverFixture, slide);
    expect(svg).toContain("<text");
    expect(svg).not.toContain("foreignObject");
    expect(svg).not.toContain("data-hit-layer");
    expect(svg).not.toContain("safe-area");
  });
});
