import { MAX_SLIDES, createDocumentId, type Layer, type ProjectDocument, type SlideDocument } from "@/core/document";
import type { LayerOperationResult } from "@/core/engine";

export function replaceSlide(document: ProjectDocument, nextSlide: SlideDocument): ProjectDocument {
  return {
    ...document,
    slides: document.slides.map((slide) => slide.id === nextSlide.id ? nextSlide : slide),
  };
}

export function applySlideOperation(
  document: ProjectDocument,
  slideId: string,
  operation: (slide: SlideDocument) => LayerOperationResult,
): ProjectDocument {
  const slide = document.slides.find((entry) => entry.id === slideId);
  if (!slide) return document;
  const result = operation(slide);
  return result.changed ? replaceSlide(document, result.slide) : document;
}

export function addLayerToSlide(document: ProjectDocument, slideId: string, layer: Layer): ProjectDocument {
  const slide = document.slides.find((entry) => entry.id === slideId);
  return slide ? replaceSlide(document, { ...slide, layers: [...slide.layers, layer] }) : document;
}

export function addBlankSlide(document: ProjectDocument): ProjectDocument {
  if (document.slides.length >= MAX_SLIDES) return document;
  const slide: SlideDocument = {
    id: createDocumentId("slide"),
    name: `شريحة ${document.slides.length + 1}`,
    layers: [],
  };
  return { ...document, slides: [...document.slides, slide] };
}

export function duplicateSlide(document: ProjectDocument, slideId: string): ProjectDocument {
  if (document.slides.length >= MAX_SLIDES) return document;
  const index = document.slides.findIndex((slide) => slide.id === slideId);
  const source = document.slides[index];
  if (!source) return document;
  const copy = structuredClone(source);
  copy.id = createDocumentId("slide");
  copy.name = `${source.name} — نسخة`;
  const slides = [...document.slides];
  slides.splice(index + 1, 0, copy);
  return { ...document, slides };
}

export function deleteSlide(document: ProjectDocument, slideId: string): ProjectDocument {
  if (document.slides.length === 1) return document;
  return { ...document, slides: document.slides.filter((slide) => slide.id !== slideId) };
}

export function reorderSlides(document: ProjectDocument, activeId: string, overId: string): ProjectDocument {
  const from = document.slides.findIndex((slide) => slide.id === activeId);
  const to = document.slides.findIndex((slide) => slide.id === overId);
  if (from < 0 || to < 0 || from === to) return document;
  const slides = [...document.slides];
  const [moved] = slides.splice(from, 1);
  if (!moved) return document;
  slides.splice(to, 0, moved);
  return { ...document, slides };
}
