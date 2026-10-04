import type { ProjectDocument, SlideDocument } from "@/core/document";
import { serializeSlideToSvg } from "@/renderer";
import { prepareExportJob, type ExportResources } from "../shared/export-job";
export async function exportSlideAsSvg(
  document: ProjectDocument,
  slide: SlideDocument,
  resources?: ExportResources,
): Promise<Blob> {
  const { assets, fontCss } = resources ?? (await prepareExportJob(document));
  return new Blob([serializeSlideToSvg(document, slide, assets, fontCss)], {
    type: "image/svg+xml;charset=utf-8",
  });
}
