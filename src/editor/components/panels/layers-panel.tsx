"use client";

import { Eye, EyeOff, Lock, Unlock } from "lucide-react";

import { flattenLayers } from "@/core/document";
import { toggleLock, toggleVisibility } from "@/editor/commands";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";

export function LayersPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId) ?? document.slides[0]?.id;
  const selectedIds = useEditorUiStore((state) => state.selectedLayerIds);
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  const slide = document.slides.find((entry) => entry.id === activeSlideId);
  if (!slide) return null;
  const entries = flattenLayers(slide.layers).reverse();
  return (
    <div className="p-3">
      {entries.length ? <div className="space-y-1">{entries.map(({ layer, depth }) => (
        <div key={layer.id} className={`flex items-center gap-1 rounded-xl border px-2 py-1.5 ${selectedIds.includes(layer.id) ? "border-brand-accent bg-brand-accent-soft" : "border-transparent hover:bg-stone-50"}`} style={{ marginInlineStart: depth * 12 }}>
          <button type="button" className="min-w-0 flex-1 truncate text-right text-xs font-semibold text-stone-700" onClick={(event) => selectLayer(layer.id, event.shiftKey)}>{layer.name}</button>
          <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="الظهور" onClick={() => toggleVisibility(session, slide.id, layer.id)}>{layer.visible ? <Eye /> : <EyeOff />}</Button>
          <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="القفل" onClick={() => toggleLock(session, slide.id, layer.id)}>{layer.locked ? <Lock /> : <Unlock />}</Button>
        </div>
      ))}</div> : <p className="p-6 text-center text-sm text-stone-400">لا توجد طبقات في هذه الشريحة.</p>}
    </div>
  );
}
