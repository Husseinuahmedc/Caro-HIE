"use client";

import { memo } from "react";

import type { Layer } from "@/core/document";
import { getCodeLayout } from "../code/code-tokenizer";
import { getCodeTheme, getCodeTokenColor } from "../code/code-themes";
import { IconGraphic } from "../icons/icon-graphic";
import { getCodeStyle, getIconRenderSize, getLayerFrameStyle, getTextStyle } from "../shared/layer-presentation";

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
    const layout = getCodeLayout(layer);
    const theme = getCodeTheme(layer.theme);
    return (
      <div
        data-layer-id={layer.id}
        data-layer-type="code"
        data-language={layer.language}
        data-theme={layer.theme}
        style={{ ...frameStyle, ...getCodeStyle(layer) }}
      >
        {layout.lines.map((line, lineIndex) => (
          <div
            key={`${line.logicalLineNumber}-${lineIndex}`}
            style={{
              display: "flex",
              minHeight: layout.lineAdvance,
              lineHeight: `${layout.lineAdvance}px`,
              background: line.highlighted ? theme.highlight : "transparent",
            }}
          >
            {layer.showLineNumbers ? (
              <span
                aria-hidden="true"
                style={{
                  width: layout.gutterWidth,
                  flex: `0 0 ${layout.gutterWidth}px`,
                  paddingInlineEnd: layer.fontSize * 0.55,
                  color: theme.lineNumber,
                  textAlign: "right",
                  userSelect: "none",
                }}
              >
                {line.showLineNumber ? line.logicalLineNumber : ""}
              </span>
            ) : null}
            <code style={{ minWidth: 0, flex: 1, whiteSpace: "pre" }}>
              {line.tokens.map((token, tokenIndex) => (
                <span
                  key={`${lineIndex}-${tokenIndex}`}
                  style={{ color: getCodeTokenColor(layer.theme, token.kind, layer.color) }}
                >
                  {token.content}
                </span>
              ))}
            </code>
          </div>
        ))}
      </div>
    );
  }
  if (layer.type === "shape") {
    const borderRadius = layer.shape === "circle" ? "50%" : layer.radius;
    const shapeStyle = layer.shape === "line"
      ? { background: layer.stroke, height: Math.max(layer.strokeWidth, 2), top: layer.y + layer.height / 2 }
      : { background: layer.fill, border: `${layer.strokeWidth}px solid ${layer.stroke}`, borderRadius };
    return <div data-layer-id={layer.id} data-layer-type="shape" style={{ ...frameStyle, ...shapeStyle }} />;
  }
  if (layer.type === "icon") {
    return (
      <div data-layer-id={layer.id} data-layer-type="icon" style={{ ...frameStyle, display: layer.visible ? "grid" : "none", placeItems: "center" }}>
        <IconGraphic
          name={layer.icon}
          size={getIconRenderSize(layer)}
          color={layer.color}
          fill={layer.fill}
          strokeWidth={layer.strokeWidth}
        />
      </div>
    );
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
