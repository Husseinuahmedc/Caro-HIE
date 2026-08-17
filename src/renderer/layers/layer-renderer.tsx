"use client";

import { memo } from "react";

import type { Layer } from "@/core/document";
import { getCodeStyle, getLayerFrameStyle, getTextStyle } from "../shared/layer-presentation";

interface LayerRendererProps {
  layer: Layer;
  assetUrls: ReadonlyMap<string, string>;
}

function LayerRendererComponent({ layer, assetUrls }: LayerRendererProps) {
  const frameStyle = getLayerFrameStyle(layer);
  if (layer.type === "group") {
    return (
      <div data-layer-id={layer.id} data-layer-type="group" style={frameStyle}>
        {layer.children.map((child) => <LayerRenderer key={child.id} layer={child} assetUrls={assetUrls} />)}
      </div>
    );
  }
  if (layer.type === "text") {
    return <div data-layer-id={layer.id} data-layer-type="text" style={{ ...frameStyle, ...getTextStyle(layer) }}><span>{layer.content}</span></div>;
  }
  if (layer.type === "code") {
    return <pre data-layer-id={layer.id} data-layer-type="code" style={{ ...frameStyle, ...getCodeStyle(layer), margin: 0 }}><code>{layer.code}</code></pre>;
  }
  if (layer.type === "shape") {
    const borderRadius = layer.shape === "circle" ? "50%" : layer.radius;
    const shapeStyle = layer.shape === "line"
      ? { background: layer.stroke, height: Math.max(layer.strokeWidth, 2), top: layer.y + layer.height / 2 }
      : { background: layer.fill, border: `${layer.strokeWidth}px solid ${layer.stroke}`, borderRadius };
    return <div data-layer-id={layer.id} data-layer-type="shape" style={{ ...frameStyle, ...shapeStyle }} />;
  }
  if (layer.type === "icon") {
    return <div data-layer-id={layer.id} data-layer-type="icon" style={{ ...frameStyle, display: layer.visible ? "grid" : "none", placeItems: "center", color: layer.color, fontSize: layer.fontSize }}>{layer.icon}</div>;
  }
  const source = layer.assetId ? assetUrls.get(layer.assetId) : undefined;
  return (
    <div data-layer-id={layer.id} data-layer-type="image" style={{ ...frameStyle, overflow: "hidden", borderRadius: layer.radius, background: "#e5e7eb" }}>
      {/* Blob URLs are local editor assets, so Next Image optimization does not apply. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {source ? <img src={source} alt={layer.alt} draggable={false} style={{ width: "100%", height: "100%", display: "block", objectFit: layer.fit }} /> : <div style={{ display: "grid", width: "100%", height: "100%", placeItems: "center", color: "#64748b", fontSize: 28 }}>صورة</div>}
    </div>
  );
}

export const LayerRenderer = memo(LayerRendererComponent);
