import type { CodeLayer, Layer, TextLayer } from "@/core/document";
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
    display: "flex",
    alignItems: "stretch",
    justifyContent,
    overflow: "hidden",
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
