import {
  getFramePreset,
  type ProjectDocument,
  type SlideDocument,
} from "@/core/document";
import { serializeSlideToSvg } from "@/renderer";
import { prepareExportJob, type ExportResources } from "../shared/export-job";
import { renderSvgToPng } from "./render-svg-to-png";
export async function exportSlideAsPng(
  document: ProjectDocument,
  slide: SlideDocument,
  scale = 1,
  resources?: ExportResources,
): Promise<Blob> {
  const { assets, fontCss } = resources ?? (await prepareExportJob(document));
  const frame = getFramePreset(document.framePresetId, document.customFrame);
  return renderSvgToPng(
    serializeSlideToSvg(document, slide, assets, fontCss),
    frame.width,
    frame.height,
    scale,
  );
}
