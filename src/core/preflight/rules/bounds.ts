import { getAbsoluteLayerBounds, getLayerAabb } from "../../engine/bounds";
import type { Layer } from "../../document";
import type { PreflightIssue, PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const overflowRule: PreflightRule = {
  id: "overflow",
  scope: "slide",
  run({ slide, frame }) {
    if (!slide) return [];
    const activeSlide = slide;
    function checkLayers(layers: Layer[], parentVisible = true): PreflightIssue[] {
      return layers.flatMap((layer) => {
        const visible = parentVisible && layer.visible;
        if (!visible) return [];
        const bounds = getLayerAabb(activeSlide, layer.id) ?? getAbsoluteLayerBounds(activeSlide, layer.id);
        const overflows = Boolean(
          bounds &&
            (bounds.x < -0.01 ||
              bounds.y < -0.01 ||
              bounds.x + bounds.width > frame.width + 0.01 ||
              bounds.y + bounds.height > frame.height + 0.01),
        );
        const issues: PreflightIssue[] = overflows
          ? [issue("overflow", "error", "العنصر يتجاوز حدود الشريحة.", { slideId: activeSlide.id, layerId: layer.id })]
          : [];
        if (layer.type === "group") {
          issues.push(...checkLayers(layer.children, visible));
        }
        return issues;
      });
    }
    return checkLayers(activeSlide.layers);
  },
};

export const safeAreaRule: PreflightRule = {
  id: "safe-area",
  scope: "slide",
  run({ slide, frame }) {
    if (!slide) return [];
    const activeSlide = slide;
    const { top, right, bottom, left } = frame.safeArea;
    function checkLayers(layers: Layer[], parentVisible = true): PreflightIssue[] {
      return layers.flatMap((layer) => {
        const visible = parentVisible && layer.visible;
        if (!visible) return [];
        if (layer.type === "group") {
          return checkLayers(layer.children, visible);
        }
        if (layer.type === "shape" || layer.type === "image") {
          return [];
        }
        const bounds = getLayerAabb(activeSlide, layer.id) ?? getAbsoluteLayerBounds(activeSlide, layer.id);
        const unsafe = Boolean(
          bounds &&
            (bounds.x < left - 0.01 ||
              bounds.y < top - 0.01 ||
              bounds.x + bounds.width > frame.width - right + 0.01 ||
              bounds.y + bounds.height > frame.height - bottom + 0.01),
        );
        const issues: PreflightIssue[] = unsafe
          ? [issue("safe-area", "info", "عنصر مهم قريب من منطقة قصّ محتملة.", { slideId: activeSlide.id, layerId: layer.id })]
          : [];
        return issues;
      });
    }
    return checkLayers(activeSlide.layers);
  },
};

