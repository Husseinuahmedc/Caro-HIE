import type { CodeLayer, IconLayer, Layer, TextLayer } from "@/core/document";
import { getEditorFontFamily } from "@/fonts";

export function getLayerFrameStyle(layer: Layer): React.CSSProperties {
  return {
    position: "absolute",
    left: layer.x,
    top: layer.y,
    width: layer.width,
    height: layer.height,
    transform: `rotate(${layer.rotation}deg)`,
    transformOrigin: "center",
    opacity: layer.opacity,
    display: layer.visible ? undefined : "none",
    boxSizing: "border-box",
  };
}

export function getTextStyle(layer: TextLayer): React.CSSProperties {
  const justifyContent = layer.verticalAlign === "top" ? "flex-start" : layer.verticalAlign === "bottom" ? "flex-end" : "center";
  return {
    display: layer.visible ? "flex" : "none",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent,
    overflow: "clip",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    direction: layer.direction,
    textAlign: layer.align,
    fontFamily: getEditorFontFamily(layer.fontFamilyId),
    fontSize: layer.fontSize,
    fontWeight: layer.fontWeight,
    lineHeight: layer.lineHeight,
    letterSpacing: layer.letterSpacing,
    color: layer.color,
  };
}

export const TEXT_CONTENT_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  flexShrink: 0,
};

export function getCodeStyle(layer: CodeLayer): React.CSSProperties {
  return {
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    direction: "ltr",
    textAlign: "left",
    fontFamily: getEditorFontFamily(layer.fontFamilyId),
    fontSize: layer.fontSize,
    lineHeight: layer.lineHeight,
    padding: layer.padding,
    borderRadius: layer.radius,
    background: layer.background,
    color: layer.color,
  };
}

export function getIconRenderSize(layer: IconLayer): number {
  return Math.max(1, Math.min(layer.fontSize, layer.width, layer.height));
}
