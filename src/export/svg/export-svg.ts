import type { ProjectDocument, SlideDocument } from "@/core/document";
import { serializeSlideToSvg } from "@/renderer";
import { collectDocumentFontIds, loadDocumentFonts } from "@/fonts";
import { prepareExportAssets } from "../shared/prepare-export-assets";
import { prepareExportFontCss } from "../shared/prepare-export-fonts";

export async function exportSlideAsSvg(document: ProjectDocument, slide: SlideDocument): Promise<Blob> {
  const [, assets, fontCss] = await Promise.all([
    loadDocumentFonts(collectDocumentFontIds(document)),
    prepareExportAssets(document),
    prepareExportFontCss(document),
  ]);
  return new Blob([serializeSlideToSvg(document, slide, assets, fontCss)], { type: "image/svg+xml;charset=utf-8" });
}
