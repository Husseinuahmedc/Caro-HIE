"use client";

import { useMemo } from "react";
import { createDocumentFromTemplate } from "@/core/templates";
import { SlideRenderer } from "@/renderer";
import { getFramePreset, type FramePresetId } from "@/core/document";

export function TemplatePreview({ templateId, framePresetId }: { templateId: string; framePresetId: FramePresetId }) {
  const document = useMemo(() => createDocumentFromTemplate(templateId, { framePresetId }), [templateId, framePresetId]);
  const frame = getFramePreset(framePresetId);
  return <div aria-hidden="true" className="flex gap-3 overflow-hidden py-3" dir="rtl">
    {document.slides.slice(0, 3).map((slide) => <div key={slide.id} className="relative shrink-0 overflow-hidden border border-black/10" style={{ width: 112, height: 112 * frame.height / frame.width }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${112 / frame.width})` }} dir="ltr"><SlideRenderer document={document} slide={slide} /></div>
    </div>)}
  </div>;
}
