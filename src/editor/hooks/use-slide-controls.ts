"use client";

import { MAX_SLIDES } from "@/core/document";
import { addBlankSlide, deleteSlide, duplicateSlide, reorderSlides } from "@/editor/commands";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";

export function useSlideControls() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId) ?? document.slides[0]?.id;
  const setActiveSlide = useEditorUiStore((state) => state.setActiveSlide);

  function add() {
    const previousIds = new Set(session.getSnapshot().slides.map((slide) => slide.id));
    session.update(addBlankSlide, { label: "إضافة شريحة", kind: "slide" });
    const added = session.getSnapshot().slides.find((slide) => !previousIds.has(slide.id));
    if (added) setActiveSlide(added.id);
  }

  function duplicate() {
    if (!activeSlideId) return;
    const previousIds = new Set(session.getSnapshot().slides.map((slide) => slide.id));
    session.update((current) => duplicateSlide(current, activeSlideId), { label: "تكرار شريحة", kind: "slide", affectedIds: [activeSlideId] });
    const duplicated = session.getSnapshot().slides.find((slide) => !previousIds.has(slide.id));
    if (duplicated) setActiveSlide(duplicated.id);
  }

  function remove() {
    if (!activeSlideId) return;
    const index = document.slides.findIndex((slide) => slide.id === activeSlideId);
    session.update((current) => deleteSlide(current, activeSlideId), { label: "حذف شريحة", kind: "slide", affectedIds: [activeSlideId] });
    const fallback = session.getSnapshot().slides[Math.max(0, index - 1)];
    if (fallback) setActiveSlide(fallback.id);
  }

  function reorder(activeId: string, overId: string) {
    if (activeId === overId) return;
    session.update((current) => reorderSlides(current, activeId, overId), { label: "ترتيب الشرائح", kind: "slide" });
  }

  return {
    document,
    activeSlideId,
    setActiveSlide,
    add,
    duplicate,
    remove,
    reorder,
    canAdd: document.slides.length < MAX_SLIDES,
    canDelete: document.slides.length > 1,
  };
}
