import { flattenLayers } from "../../document";
import { getAbsoluteLayerBounds } from "../../engine/bounds";
import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const overflowRule: PreflightRule = {
  id: "overflow",
  scope: "slide",
  run({ slide, frame }) {
    if (!slide) return [];
    return flattenLayers(slide.layers).flatMap(({ layer }) => {
      const bounds = getAbsoluteLayerBounds(slide, layer.id);
      const overflows = Boolean(bounds && (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > frame.width || bounds.y + bounds.height > frame.height));
      return overflows
        ? [issue(this.id, "error", "العنصر يتجاوز حدود الشريحة.", { slideId: slide.id, layerId: layer.id })]
        : [];
    });
  },
};

export const safeAreaRule: PreflightRule = {
  id: "safe-area",
  scope: "slide",
  run({ slide, frame }) {
    if (!slide) return [];
    const { top, right, bottom, left } = frame.safeArea;
    return flattenLayers(slide.layers).flatMap(({ layer }) => {
      if (layer.type === "shape" || layer.type === "image") return [];
      const bounds = getAbsoluteLayerBounds(slide, layer.id);
      const unsafe = Boolean(bounds && (bounds.x < left || bounds.y < top || bounds.x + bounds.width > frame.width - right || bounds.y + bounds.height > frame.height - bottom));
      return unsafe
        ? [issue(this.id, "info", "عنصر مهم قريب من منطقة قصّ محتملة.", { slideId: slide.id, layerId: layer.id })]
        : [];
    });
  },
};
