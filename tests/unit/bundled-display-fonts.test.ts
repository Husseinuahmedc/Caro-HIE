import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { serializeBundledFontFace } from "@/export/shared/prepare-export-fonts";
import { EDITOR_FONT_REGISTRY, getEditorFont } from "@/fonts";

const displayFontIds = [
  "ario-dots-1",
  "ario-dots-2",
  "ario-dots-3",
  "ario-dots-4",
  "rooyin-free",
  "rooyin-free-dots-2",
] as const;

describe("bundled uploaded display fonts", () => {
  it("registers only the audited OFL families with their detected weights", () => {
    expect(getEditorFont("ario-dots-1").weights).toEqual([400]);
    expect(getEditorFont("ario-dots-4").weights).toEqual([400]);
    expect(getEditorFont("rooyin-free").weights).toEqual([400, 700]);
    expect(getEditorFont("rooyin-free-dots-2").weights).toEqual([400]);
  });

  it("ships every registered display font source and its browser-readable license", () => {
    for (const fontId of displayFontIds) {
      const font = getEditorFont(fontId);
      expect(font.provider).toBe("bundled");
      expect(font.category).toBe("display");
      expect(font.license).toBe("SIL Open Font License 1.1");
      expect(font.licensePath).not.toBeNull();
      expect(existsSync(resolve(process.cwd(), "public", font.licensePath!.slice(1)))).toBe(true);

      for (const source of font.sources) {
        expect(source.format).toBe("truetype");
        expect(existsSync(resolve(process.cwd(), "public", source.path.slice(1)))).toBe(true);
      }
    }
  });

  it("embeds TrueType display fonts in portable export CSS", () => {
    const font = EDITOR_FONT_REGISTRY.find((candidate) => candidate.id === "rooyin-free")!;
    const css = serializeBundledFontFace(font, font.sources[0]!, "data:font/ttf;base64,dGVzdA==");

    expect(css).toContain(`font-family:"${font.family}"`);
    expect(css).toContain("font-weight:400");
    expect(css).toContain('format("truetype")');
    expect(css).toContain("data:font/ttf;base64,dGVzdA==");
  });
});
