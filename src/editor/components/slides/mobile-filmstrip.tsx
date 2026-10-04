"use client";
import { Plus } from "lucide-react";
import { useSlideControls } from "@/editor/hooks/use-slide-controls";
import { ArtworkPreview } from "../dashboard/artwork-preview";
import { useEditorAssets } from "../workspace/editor-assets-context";
export function MobileFilmstrip() {
  const controls = useSlideControls(),
    { assetUrls } = useEditorAssets();
  const index = controls.document.slides.findIndex(
    (slide) => slide.id === controls.activeSlideId,
  );
  const start = Math.max(0, index - 2),
    slides = controls.document.slides.slice(start, start + 5);
  return (
    <nav
      aria-label="التنقل بين الشرائح"
      className="flex shrink-0 items-center gap-3 overflow-x-auto border-t border-brand-border bg-surface-strong p-3 lg:hidden"
    >
      {slides.map((slide) => (
        <button
          key={slide.id}
          aria-current={
            slide.id === controls.activeSlideId ? "true" : undefined
          }
          className={`w-16 shrink-0 rounded-lg border p-1 ${slide.id === controls.activeSlideId ? "border-primary bg-brand-accent-soft font-bold" : "border-transparent"}`}
          onClick={() => controls.setActiveSlide(slide.id)}
        >
          <ArtworkPreview
            document={controls.document}
            slide={slide}
            assetUrls={assetUrls}
          />
          <span className="block text-xs tabular-nums">
            {controls.document.slides.indexOf(slide) + 1}
          </span>
        </button>
      ))}
      <button
        className="grid size-11 shrink-0 place-items-center rounded-lg border border-brand-border"
        aria-label="إضافة شريحة"
        onClick={controls.add}
      >
        <Plus className="size-5" />
      </button>
    </nav>
  );
}
