import type { Layer, ProjectDocument } from "../document";

function applyPlanToLayer(
  layer: Layer,
  item: ProjectDocument["contentPlan"]["slides"][number],
): Layer {
  if (layer.type === "text") {
    const key = layer.contentKey ?? (layer.name.includes("وصف") || layer.name.includes("فرعي") ? "body" : "title");
    return { ...layer, content: key === "body" ? item.body : item.title };
  }
  if (layer.type === "code" && item.code !== undefined) return { ...layer, code: item.code };
  if (layer.type === "group") {
    return { ...layer, children: layer.children.map((child) => applyPlanToLayer(child, item)) };
  }
  return layer;
}

export function applyContentPlan(document: ProjectDocument): ProjectDocument {
  return {
    ...document,
    slides: document.slides.map((slide, index) => {
      const item =
        document.contentPlan.slides.find((candidate) => candidate.role === slide.role) ??
        document.contentPlan.slides[index];
      if (!item) return slide;
      return {
        ...slide,
        name: item.label,
        layers: slide.layers.map((layer) => applyPlanToLayer(layer, item)),
      };
    }),
  };
}
