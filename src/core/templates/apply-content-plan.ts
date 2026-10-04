import type { Layer, ProjectDocument } from "../document";

function applyPlanToLayer(
  layer: Layer,
  item: ProjectDocument["contentPlan"]["slides"][number],
): Layer {
  if (layer.type === "text") {
    if (layer.contentKey !== "title" && layer.contentKey !== "body") return layer;
    const key = layer.contentKey;
    return { ...layer, content: key === "body" ? item.body : item.title };
  }
  if (layer.type === "code" && item.code !== undefined)
    return { ...layer, code: item.code };
  if (layer.type === "group") {
    return {
      ...layer,
      children: layer.children.map((child) => applyPlanToLayer(child, item)),
    };
  }
  return layer;
}

export function applyContentPlan(document: ProjectDocument): ProjectDocument {
  return {
    ...document,
    slides: document.slides.map((slide, index) => {
      const item =
        document.contentPlan.slides.find(
          (candidate) => candidate.id === slide.id,
        ) ?? document.contentPlan.slides[index];
      if (!item) return slide;
      return {
        ...slide,
        name: item.label,
        layers: slide.layers.map((layer) => applyPlanToLayer(layer, item)),
      };
    }),
  };
}
