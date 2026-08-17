import { describe, expect, it } from "vitest";

import {
  createBlankProjectDocument,
  createCodeLayer,
  createIconLayer,
} from "@/core/document";
import { getCodeLayout } from "@/renderer/code/code-tokenizer";
import { serializeSlideToSvg } from "@/renderer";

describe("code rendering", () => {
  it("tokenizes code, preserves line numbers, and marks highlighted lines", () => {
    const layer = createCodeLayer({
      code: "const answer = 42;\n// explanation\nreturn answer;",
      language: "typescript",
      highlightedLines: [2],
      showLineNumbers: true,
    });

    const layout = getCodeLayout(layer);

    expect(layout.lines[0]?.tokens).toEqual(expect.arrayContaining([
      expect.objectContaining({ content: "const", kind: "keyword" }),
      expect.objectContaining({ content: "42", kind: "number" }),
    ]));
    expect(layout.lines.find((line) => line.logicalLineNumber === 2)).toMatchObject({
      showLineNumber: true,
      highlighted: true,
    });
  });

  it("serializes syntax colors and line highlights into canonical SVG", () => {
    const document = createBlankProjectDocument();
    const layer = createCodeLayer({
      id: "code",
      code: "const value = 'ready';",
      highlightedLines: [1],
      theme: "github-dark",
    });
    document.slides[0]!.layers = [layer];

    const svg = serializeSlideToSvg(document, document.slides[0]!);

    expect(svg).toContain("#ff7b72");
    expect(svg).toContain("#a5d6ff");
    expect(svg).toContain("#161b22");
    expect(svg).toContain(">1</text>");
  });
});

describe("icon rendering", () => {
  it("serializes vector icon nodes instead of a font glyph", () => {
    const document = createBlankProjectDocument();
    const layer = createIconLayer({
      id: "database-icon",
      icon: "database",
      color: "#2563eb",
      fill: "none",
      strokeWidth: 2.5,
    });
    document.slides[0]!.layers = [layer];

    const svg = serializeSlideToSvg(document, document.slides[0]!);

    expect(svg).toContain("<ellipse");
    expect(svg).toContain('stroke="#2563eb"');
    expect(svg).toContain('stroke-width="2.5"');
    expect(svg).not.toContain("✦");
  });
});
