import { getFramePreset, type ProjectDocument } from "@/core/document";
import { serializeSlideToSvg } from "@/renderer";
import {
  prepareExportJob,
  type ExportJobOptions,
  type ExportResources,
} from "../shared/export-job";
import { renderSvgToPng } from "../png/render-svg-to-png";
export async function exportProjectAsPdf(
  document: ProjectDocument,
  options: ExportJobOptions = {},
  resources?: ExportResources,
): Promise<Blob> {
  const [{ PDFDocument }, { assets, fontCss }] = await Promise.all([
    import("pdf-lib"),
    resources ?? prepareExportJob(document, options.signal),
  ]);
  const frame = getFramePreset(document.framePresetId, document.customFrame),
    pdf = await PDFDocument.create();
  const slides = options.slides ?? document.slides;
  for (const [index, slide] of slides.entries()) {
    options.signal?.throwIfAborted();
    const png = await renderSvgToPng(
      serializeSlideToSvg(document, slide, assets, fontCss),
      frame.width,
      frame.height,
    );
    options.signal?.throwIfAborted();
    const embedded = await pdf.embedPng(await png.arrayBuffer());
    pdf.addPage([frame.width, frame.height]).drawImage(embedded, {
      x: 0,
      y: 0,
      width: frame.width,
      height: frame.height,
    });
    options.onProgress?.(index + 1, slides.length);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  options.signal?.throwIfAborted();
  return new Blob([(await pdf.save()) as BlobPart], {
    type: "application/pdf",
  });
}
