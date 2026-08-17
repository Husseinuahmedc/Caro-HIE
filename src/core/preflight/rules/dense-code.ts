import { flattenLayers } from "../../document";
import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const denseCodeRule: PreflightRule = {
  id: "dense-code",
  scope: "slide",
  run({ slide }) {
    if (!slide) return [];
    return flattenLayers(slide.layers).flatMap(({ layer }) => {
      if (layer.type !== "code") return [];
      const lines = layer.code.split("\n");
      const tooDense = lines.length > 14 || lines.some((line) => line.length > 74);
      return tooDense
        ? [issue(this.id, "warning", "كتلة الكود كثيفة؛ اختصرها أو وزّعها على أكثر من شريحة.", { slideId: slide.id, layerId: layer.id })]
        : [];
    });
  },
};
