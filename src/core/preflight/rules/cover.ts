import { flattenLayers } from "../../document";
import type { PreflightRule } from "../preflight-types";
import { issue } from "../preflight-types";

export const missingCoverRule: PreflightRule = {
  id: "missing-cover",
  scope: "document",
  run({ document }) {
    const cover = document.slides.find((slide) => slide.role === "cover");
    return cover ? [] : [issue(this.id, "error", "المشروع لا يحتوي على شريحة غلاف.")];
  },
};

export const weakCoverRule: PreflightRule = {
  id: "weak-cover",
  scope: "document",
  run({ document }) {
    const cover = document.slides.find((slide) => slide.role === "cover");
    if (!cover) return [];
    const titleEntry = flattenLayers(cover.layers).find(({ layer }) => layer.type === "text" && layer.contentKey === "title");
    const title = titleEntry?.layer;
    if (!title || title.type !== "text" || title.content.trim().length < 8) {
      return [issue(this.id, "warning", "عنوان الغلاف قصير أو غير واضح بما يكفي.", { slideId: cover.id, layerId: title?.id })];
    }
    return [];
  },
};
