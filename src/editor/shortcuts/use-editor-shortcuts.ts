"use client";

import { useEffect } from "react";

import { moveSelectedLayers } from "@/core/engine";
import { applySlideOperation, duplicateOneLayer, groupSelection, removeLayers, ungroupSelection } from "@/editor/commands";
import { useDocumentSession } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";

export function useEditorShortcuts(onSave: () => Promise<void>) {
  const session = useDocumentSession();
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const editingText = target?.matches("input, textarea, select, [contenteditable='true']");
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void onSave();
        return;
      }
      if (editingText) return;

      const isModalOpen = Boolean(
        window.document.querySelector('[role="dialog"]:not([aria-modal="false"])') ||
        window.document.querySelector('[aria-modal="true"]') ||
        target?.closest('[role="dialog"]:not([aria-modal="false"])')
      );
      if (isModalOpen) return;

      const { activeSlideId, selectedLayerIds, clearSelection, selectLayer } = useEditorUiStore.getState();
      const document = session.getSnapshot();
      const slideId = activeSlideId ?? document.slides[0]?.id;
      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) session.redo();
        else session.undo();
      } else if (modifier && event.key.toLowerCase() === "y") {
        event.preventDefault();
        session.redo();
      } else if ((event.key === "Delete" || event.key === "Backspace") && slideId && selectedLayerIds.length) {
        event.preventDefault();
        removeLayers(session, slideId, selectedLayerIds);
        clearSelection();
      } else if (modifier && event.key.toLowerCase() === "d" && slideId && selectedLayerIds.length === 1) {
        event.preventDefault();
        const id = duplicateOneLayer(session, slideId, selectedLayerIds[0] ?? "");
        if (id) selectLayer(id);
      } else if (modifier && event.shiftKey && event.key.toLowerCase() === "g" && slideId && selectedLayerIds.length === 1) {
        event.preventDefault();
        ungroupSelection(session, slideId, selectedLayerIds[0] ?? "");
        clearSelection();
      } else if (modifier && event.key.toLowerCase() === "g" && slideId && selectedLayerIds.length > 1) {
        event.preventDefault();
        const id = groupSelection(session, slideId, selectedLayerIds);
        if (id) selectLayer(id);
      } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) && slideId && selectedLayerIds.length) {
        event.preventDefault();
        const amount = event.shiftKey ? 10 : 1;
        const delta = { x: event.key === "ArrowLeft" ? -amount : event.key === "ArrowRight" ? amount : 0, y: event.key === "ArrowUp" ? -amount : event.key === "ArrowDown" ? amount : 0 };
        session.update((current) => applySlideOperation(current, slideId, (slide) => moveSelectedLayers(slide, selectedLayerIds, delta, current.framePresetId)), { label: "تحريك عناصر بلوحة المفاتيح", kind: "layer", affectedIds: selectedLayerIds });
      } else if (event.key === "Escape") {
        clearSelection();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSave, session]);
}
