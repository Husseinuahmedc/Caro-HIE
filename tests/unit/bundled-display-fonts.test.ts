import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { serializeBundledFontFace } from "@/export/shared/prepare-export-fonts";
import { EDITOR_FONT_REGISTRY, getEditorFont } from "@/fonts";

const displayFonts = EDITOR_FONT_REGISTRY.filter((font) => font.provider === "bundled" && font.category === "display");

describe("bundled uploaded display fonts", () => {
  it("registers the complete uploaded font pack with detected weights", () => {
    expect(displayFonts).toHaveLength(30);
    expect(displayFonts.flatMap((font) => font.sources)).toHaveLength(104);
    expect(getEditorFont("ario-dots-1").weights).toEqual([400]);
    expect(getEditorFont("rooyin-free").weights).toEqual([400, 700]);
    expect(getEditorFont("arsenica-arabic-trial").weights).toEqual([100, 300, 400, 500, 600, 700, 800]);
    expect(getEditorFont("codec-pro-me-trial").weights).toEqual([100, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900]);
    expect(getEditorFont("f37-wicklow-arabic-stencil-trial").weights).toEqual([300, 400, 500, 700, 800, 900]);
  });

  it("ships every registered source and browser-readable license notice", () => {
    for (const font of displayFonts) {
      expect(font.licensePath).not.toBeNull();
      expect(existsSync(resolve(process.cwd(), "public", font.licensePath!.slice(1)))).toBe(true);
      for (const source of font.sources) {
        expect(["truetype", "opentype"]).toContain(source.format);
        expect(existsSync(resolve(process.cwd(), "public", source.path.slice(1)))).toBe(true);
      }
    }
  });

  it("embeds TrueType and OpenType files in portable export CSS", () => {
    const trueTypeFont = getEditorFont("rooyin-free");
    const openTypeFont = getEditorFont("milan-display");
    const trueTypeCss = serializeBundledFontFace(trueTypeFont, trueTypeFont.sources[0]!, "data:font/ttf;base64,dGVzdA==");
    const openTypeCss = serializeBundledFontFace(openTypeFont, openTypeFont.sources[0]!, "data:font/otf;base64,dGVzdA==");

    expect(trueTypeCss).toContain('format("truetype")');
    expect(openTypeCss).toContain('format("opentype")');
    expect(openTypeCss).toContain(`font-family:"${openTypeFont.family}"`);
  });
});
