import { flattenLayers } from "../../document";
import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const longTextRule: PreflightRule = {
  id: "long-text",
  scope: "slide",
  run({ slide }) {
    if (!slide) return [];
    return flattenLayers(slide.layers).flatMap(({ layer }) => {
      if (layer.type !== "text") return [];
      const limit = layer.contentKey === "title" ? 90 : 260;
      if (layer.content.trim().length <= limit) return [];
      return [issue(this.id, "warning", "النص طويل وقد يصعب قراءته على الهاتف.", { slideId: slide.id, layerId: layer.id })];
    });
  },
};
