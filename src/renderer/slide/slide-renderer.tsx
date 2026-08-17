"use client";

import { memo } from "react";

import { getFramePreset, type ProjectDocument, type SlideDocument } from "@/core/document";
import { LayerRenderer } from "../layers/layer-renderer";

interface SlideRendererProps {
  document: ProjectDocument;
  slide: SlideDocument;
  assetUrls?: ReadonlyMap<string, string>;
  className?: string;
}

const EMPTY_ASSET_URLS: ReadonlyMap<string, string> = new Map();

function SlideRendererComponent({ document, slide, assetUrls = EMPTY_ASSET_URLS, className }: SlideRendererProps) {
  const frame = getFramePreset(document.framePresetId);
  return (
    <div
      className={className}
      data-slide-id={slide.id}
      style={{
        position: "relative",
        width: frame.width,
        height: frame.height,
        overflow: "hidden",
        isolation: "isolate",
        background: document.brand.colors.background,
        color: document.brand.colors.text,
      }}
    >
      {slide.layers.map((layer) => <LayerRenderer key={layer.id} layer={layer} assetUrls={assetUrls} />)}
    </div>
  );
}

export const SlideRenderer = memo(
  SlideRendererComponent,
  (previous, next) =>
    previous.slide === next.slide &&
    previous.assetUrls === next.assetUrls &&
    previous.document.framePresetId === next.document.framePresetId &&
    previous.document.brand === next.document.brand &&
    previous.className === next.className,
);
