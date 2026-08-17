import { describe, expect, it } from "vitest";

import { createCodeLayer, createTextLayer } from "@/core/document";
import { runPreflight } from "@/core/preflight";
import { arabicCoverFixture } from "../fixtures/project-fixtures";

describe("preflight rule engine", () => {
  it("reports independent rules with stable targets", () => {
    const document = structuredClone(arabicCoverFixture);
    const slide = document.slides[0]!;
    slide.layers = [
      createTextLayer({ id: "weak", contentKey: "title", content: "قصير", x: -20, color: document.brand.colors.background }),
      createCodeLayer({ id: "dense", code: Array.from({ length: 18 }, () => "const excessivelyLongIdentifier = true;").join("\n") }),
    ];
    const issues = runPreflight(document);
    expect(issues.map((item) => item.ruleId)).toEqual(expect.arrayContaining(["weak-cover", "overflow", "contrast", "dense-code"]));
    expect(issues.find((item) => item.ruleId === "overflow")?.target).toMatchObject({ slideId: slide.id, layerId: "weak" });
  });

  it("reports a missing cover", () => {
    const document = structuredClone(arabicCoverFixture);
    document.slides.forEach((slide) => { delete slide.role; });
    expect(runPreflight(document).some((issue) => issue.ruleId === "missing-cover")).toBe(true);
  });
});
