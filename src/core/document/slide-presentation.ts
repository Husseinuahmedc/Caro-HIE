import type { Layer, ProjectDocument, SlideDocument } from "./types";
/** Derived numbering follows project order, including after undo, reorder and export ranges. */
export function getSlidePresentationLayers(
  document: ProjectDocument,
  slide: SlideDocument,
): Layer[] {
  const index = document.slides.findIndex(
    (candidate) => candidate.id === slide.id,
  );
  function present(layer: Layer): Layer {
    if (layer.type === "text" && layer.contentKey === "slide-number")
      return {
        ...layer,
        content: `${String(index + 1).padStart(2, "0")} / ${document.slides.length}`,
      };
    if (layer.type === "group")
      return { ...layer, children: layer.children.map(present) };
    return layer;
  }
  return slide.layers.map(present);
}
