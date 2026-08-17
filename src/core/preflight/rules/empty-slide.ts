import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const emptySlideRule: PreflightRule = {
  id: "empty-slide",
  scope: "slide",
  run({ slide }) {
    if (!slide || slide.layers.some((layer) => layer.visible)) return [];
    return [issue(this.id, "error", "الشريحة فارغة ولا تحتوي على عناصر ظاهرة.", { slideId: slide.id })];
  },
};
