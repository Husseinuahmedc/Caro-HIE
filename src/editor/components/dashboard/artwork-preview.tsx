"use client";
import { useEffect, useRef, useState } from "react";
import {
  getFramePreset,
  type ProjectDocument,
  type SlideDocument,
} from "@/core/document";
import { loadDocumentFonts, collectDocumentFontIds } from "@/fonts";
import { SlideRenderer } from "@/renderer";

export function ArtworkPreview({
  document,
  slide = document.slides[0],
  assetUrls,
  className = "",
  totalSlides,
}: {
  document: ProjectDocument;
  slide?: SlideDocument;
  assetUrls?: ReadonlyMap<string, string>;
  className?: string;
  totalSlides?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const frame = getFramePreset(document.framePresetId, document.customFrame);
  useEffect(() => { void loadDocumentFonts(collectDocumentFontIds(document)); }, [document]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry?.contentRect.width ?? 0),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: `${frame.width}/${frame.height}`,
        background: document.brand.colors.background,
      }}
      aria-label={slide?.name}
    >
      {slide && width > 0 ? (
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ transform: `scale(${width / frame.width})` }}
          dir="ltr"
        >
          <SlideRenderer
            document={document}
            slide={slide}
            assetUrls={assetUrls}
            totalSlides={totalSlides}
          />
        </div>
      ) : null}
    </div>
  );
}
