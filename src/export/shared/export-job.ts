import type { ProjectDocument, SlideDocument } from "@/core/document";
import { collectDocumentFontIds, loadDocumentFonts } from "@/fonts";
import { prepareExportAssets } from "./prepare-export-assets";
import { prepareExportFontCss } from "./prepare-export-fonts";

export interface ExportJobOptions {
  slides?: SlideDocument[];
  signal?: AbortSignal;
  onProgress?: (completed: number, total: number) => void;
}
export async function prepareExportJob(
  document: ProjectDocument,
  signal?: AbortSignal,
) {
  signal?.throwIfAborted();
  const [, assets, fontCss] = await Promise.all([
    loadDocumentFonts(collectDocumentFontIds(document)),
    prepareExportAssets(document),
    prepareExportFontCss(document),
  ]);
  signal?.throwIfAborted();
  return { assets, fontCss };
}
export type ExportResources = Awaited<ReturnType<typeof prepareExportJob>>;
/** One-based inclusive ranges, deduplicated in project order: 1-4, 8, 12-14. */
export function selectExportSlides(
  slides: SlideDocument[],
  range: string,
): SlideDocument[] {
  const selected = new Set<number>();
  for (const part of range.split(",")) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("اكتب نطاقاً مثل 1-4, 8.");
    const from = Number(match[1]),
      to = Number(match[2] ?? match[1]);
    if (
      !Number.isSafeInteger(from) ||
      !Number.isSafeInteger(to) ||
      from < 1 ||
      to < from ||
      to > slides.length
    )
      throw new Error(`النطاق يجب أن يكون بين 1 و ${slides.length}.`);
    for (let i = from; i <= to; i++) selected.add(i - 1);
  }
  return slides.filter((_, i) => selected.has(i));
}
export function exportSlideFilename(
  base: string,
  index: number,
  total: number,
  format: string,
): string {
  return `${base}-${String(index + 1).padStart(Math.max(2, String(total).length), "0")}.${format}`;
}
