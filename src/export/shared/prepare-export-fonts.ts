import type { ProjectDocument } from "@/core/document";
import { collectDocumentFontIds, getEditorFont, type EditorFontDefinition, type EditorFontSource } from "@/fonts";
import { blobToDataUrl } from "./blob-to-data-url";
import { embedRemoteFontStylesheet } from "./embed-remote-font-css";

export function serializeBundledFontFace(font: EditorFontDefinition, source: EditorFontSource, dataUrl: string): string {
  const range = source.unicodeRange ? `unicode-range:${source.unicodeRange};` : "";
  return `@font-face{font-family:"${font.family}";font-style:${font.style};font-weight:${source.weight};src:url("${dataUrl}") format("${source.format}");${range}}`;
}

async function prepareFontCss(font: ReturnType<typeof getEditorFont>): Promise<string> {
  if (font.stylesheetUrl) return embedRemoteFontStylesheet(font.stylesheetUrl);
  const declarations = await Promise.all(font.sources.map(async (source) => {
    const response = await fetch(source.path);
    if (!response.ok) throw new Error(`Failed to load export font: ${source.path}`);
    const dataUrl = await blobToDataUrl(await response.blob());
    return serializeBundledFontFace(font, source, dataUrl);
  }));
  return declarations.join("");
}

export async function prepareExportFontCss(document: ProjectDocument): Promise<string> {
  const fonts = collectDocumentFontIds(document).map(getEditorFont);
  return (await Promise.all(fonts.map(prepareFontCss))).join("");
}
