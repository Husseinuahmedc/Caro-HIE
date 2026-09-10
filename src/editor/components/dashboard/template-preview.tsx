import { useId, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getFramePreset, type FramePresetId } from "@/core/document";
import { createDocumentFromTemplate } from "@/core/templates";
import { SlideRenderer } from "@/renderer";

const CARD_WIDTH = 156;

export function TemplatePreview({
  templateId,
  framePresetId,
}: {
  templateId: string;
  framePresetId: FramePresetId;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const document = useMemo(
    () => createDocumentFromTemplate(templateId, { framePresetId }),
    [templateId, framePresetId]
  );
  const frame = getFramePreset(framePresetId);
  const cardHeight = Math.round((CARD_WIDTH * frame.height) / frame.width);
  const scale = CARD_WIDTH / frame.width;
  const labelId = useId();

  function scroll(direction: "left" | "right") {
    if (!containerRef.current) return;
    const delta = direction === "left" ? -(CARD_WIDTH + 16) : CARD_WIDTH + 16;
    containerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div className="relative py-3" aria-labelledby={labelId}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span id={labelId} className="text-xs font-bold text-brand-muted">
          عرض الشرائح ({document.slides.length} شرائح)
        </span>
        <div className="flex items-center gap-1.5" dir="ltr">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg border border-brand-border bg-surface-strong text-primary transition hover:bg-surface disabled:opacity-30"
            aria-label="الشريحة السابقة"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-lg border border-brand-border bg-surface-strong text-primary transition hover:bg-surface disabled:opacity-30"
            aria-label="الشريحة التالية"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        role="region"
        aria-label="معاينة شرائح القالب"
        tabIndex={0}
        dir="rtl"
        className="flex max-w-full gap-4 overflow-x-auto overscroll-contain pb-2 pt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
      >
        {document.slides.map((slide, index) => {
          const isBlank = !slide.layers.length;
          return (
            <div
              key={slide.id}
              className="flex shrink-0 flex-col gap-2"
            >
              <div
                className="relative overflow-hidden rounded-lg border border-brand-border bg-surface-strong shadow-sm transition hover:shadow-md"
                style={{ width: CARD_WIDTH, height: cardHeight }}
              >
                {isBlank ? (
                  <div className="grid h-full w-full place-items-center border-2 border-dashed border-primary/20 p-2 text-center text-xs font-bold text-brand-muted">
                    شريحة فارغة
                  </div>
                ) : (
                  <div
                    className="absolute left-0 top-0 origin-top-left pointer-events-none select-none"
                    style={{
                      width: frame.width,
                      height: frame.height,
                      transform: `scale(${scale})`,
                    }}
                    dir="ltr"
                  >
                    <SlideRenderer document={document} slide={slide} />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                <span className="truncate">{index + 1}. {slide.name}</span>
                <span className="text-[10px] text-brand-muted">{frame.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

