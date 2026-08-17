import { flattenLayers } from "../../document";
import { contrastRatio } from "../color-contrast";
import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const contrastRule: PreflightRule = {
  id: "contrast",
  scope: "slide",
  run({ document, slide }) {
    if (!slide) return [];
    const background = document.brand.colors.background;
    return flattenLayers(slide.layers).flatMap(({ layer }) => {
      if (layer.type !== "text" || contrastRatio(layer.color, background) >= 3) return [];
      return [issue(this.id, "warning", "تباين النص مع الخلفية منخفض.", { slideId: slide.id, layerId: layer.id })];
    });
  },
};
