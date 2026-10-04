import { wrapText } from "../../document/text-layout";
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
      const maxCharacters = Math.max(
        1,
        Math.floor(layer.width / (layer.fontSize * 0.55)),
      );
      const maxLines = Math.max(
        1,
        Math.floor(layer.height / (layer.fontSize * layer.lineHeight)),
      );
      if (wrapText(layer.content, maxCharacters).length > maxLines)
        return [
          issue(
            "text-fit",
            "warning",
            "النص قد لا يتسع داخل العنصر. قلّل حجم الخط أو زِد مساحة النص.",
            { slideId: slide.id, layerId: layer.id },
          ),
        ];
      const limit = layer.contentKey === "title" ? 90 : 260;
      if (layer.content.trim().length <= limit) return [];
      return [
        issue(this.id, "warning", "النص طويل وقد يصعب قراءته على الهاتف.", {
          slideId: slide.id,
          layerId: layer.id,
        }),
      ];
    });
  },
};
