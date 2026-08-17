import { getFramePreset, type ProjectDocument } from "@/core/document";
import { collectDocumentFontIds, loadDocumentFonts } from "@/fonts";
import { serializeSlideToSvg } from "@/renderer";
import { prepareExportAssets } from "../shared/prepare-export-assets";
import { prepareExportFontCss } from "../shared/prepare-export-fonts";
import { renderSvgToPng } from "../png/render-svg-to-png";

export async function exportProjectAsPdf(document: ProjectDocument): Promise<Blob> {
  const [{ PDFDocument }, assets, , fontCss] = await Promise.all([
    import("pdf-lib"),
    prepareExportAssets(document),
    loadDocumentFonts(collectDocumentFontIds(document)),
    prepareExportFontCss(document),
  ]);
  const frame = getFramePreset(document.framePresetId);
  const pdf = await PDFDocument.create();
  for (const slide of document.slides) {
    const png = await renderSvgToPng(serializeSlideToSvg(document, slide, assets, fontCss), frame.width, frame.height);
    const embedded = await pdf.embedPng(await png.arrayBuffer());
    const page = pdf.addPage([frame.width, frame.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: frame.width, height: frame.height });
  }
  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
