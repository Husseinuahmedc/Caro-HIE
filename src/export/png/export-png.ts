import { getFramePreset, type ProjectDocument, type SlideDocument } from "@/core/document";
import { collectDocumentFontIds, loadDocumentFonts } from "@/fonts";
import { serializeSlideToSvg } from "@/renderer";
import { prepareExportAssets } from "../shared/prepare-export-assets";
import { prepareExportFontCss } from "../shared/prepare-export-fonts";
import { renderSvgToPng } from "./render-svg-to-png";

export async function exportSlideAsPng(document: ProjectDocument, slide: SlideDocument, scale = 1): Promise<Blob> {
  const [, assets, fontCss] = await Promise.all([
    loadDocumentFonts(collectDocumentFontIds(document)),
    prepareExportAssets(document),
    prepareExportFontCss(document),
  ]);
  const frame = getFramePreset(document.framePresetId);
  return renderSvgToPng(serializeSlideToSvg(document, slide, assets, fontCss), frame.width, frame.height, scale);
}
