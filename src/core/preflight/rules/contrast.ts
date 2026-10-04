import { flattenLayers } from "../../document";
import { getAbsoluteLayerBounds } from "../../engine/bounds";
import { contrastRatio } from "../color-contrast";
import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";
export const contrastRule: PreflightRule = {
  id: "contrast",
  scope: "slide",
  run({ document, slide }) {
    if (!slide) return [];
    const entries = flattenLayers(slide.layers);
    return entries.flatMap(({ layer }, index) => {
      if (layer.type !== "text" || !layer.visible) return [];
      const bounds = getAbsoluteLayerBounds(slide, layer.id);
      let background = document.brand.colors.background;
      if (bounds)
        for (const { layer: under } of entries.slice(0, index)) {
          if (
            under.type !== "shape" ||
            under.shape !== "rect" ||
            !under.visible ||
            under.opacity !== 1 ||
            under.rotation
          )
            continue;
          const box = getAbsoluteLayerBounds(slide, under.id);
          if (
            box &&
            box.x <= bounds.x &&
            box.y <= bounds.y &&
            box.x + box.width >= bounds.x + bounds.width &&
            box.y + box.height >= bounds.y + bounds.height
          )
            background = under.fill;
        }
      return contrastRatio(layer.color, background) >= 3
        ? []
        : [
            issue(this.id, "warning", "تباين النص مع الخلفية منخفض.", {
              slideId: slide.id,
              layerId: layer.id,
            }),
          ];
    });
  },
};
