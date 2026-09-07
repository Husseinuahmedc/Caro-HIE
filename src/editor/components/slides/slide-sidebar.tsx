"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CopyPlus, Plus, Trash2 } from "lucide-react";

import { MAX_SLIDES } from "@/core/document";
import { useSlideControls } from "@/editor/hooks/use-slide-controls";
import { Button } from "@/shared/ui";
import { useEditorAssets } from "../workspace/editor-assets-context";
import { SortableSlideThumbnail } from "./sortable-slide-thumbnail";
import { useState } from "react";
import { LayersPanel } from "../panels/layers-panel";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";

export function SlideSidebar({ mobile = false }: { mobile?: boolean }) {
  const [tab, setTab] = useState<"slides" | "layers">("slides");
  const controls = useSlideControls();
  const { document, activeSlideId, setActiveSlide } = controls;
  const { assetUrls } = useEditorAssets();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function onDragEnd(event: DragEndEvent) {
    if (!event.over) return;
    controls.reorder(String(event.active.id), String(event.over.id));
  }

  return (
    <aside aria-label="الشرائح والطبقات" className={mobile ? "flex min-h-80 flex-col" : "hidden w-60 shrink-0 flex-col border-l border-brand-border bg-surface lg:flex"}>
      <div className="grid grid-cols-2 border-b border-brand-border" role="tablist" aria-label="التنقل في المشروع">
        <button role="tab" aria-selected={tab === "slides"} className={`min-h-12 text-sm font-bold ${tab === "slides" ? "border-b-2 border-primary text-primary" : "text-brand-muted"}`} onClick={() => setTab("slides")}>الشرائح</button>
        <button role="tab" aria-selected={tab === "layers"} className={`min-h-12 text-sm font-bold ${tab === "layers" ? "border-b-2 border-primary text-primary" : "text-brand-muted"}`} onClick={() => setTab("layers")}>الطبقات</button>
      </div>
      {tab === "layers" ? <div className="min-h-0 flex-1 overflow-y-auto"><LayersPanel /></div> : <>
      <div className="flex h-12 items-center justify-between border-b border-stone-200 px-3"><strong className="text-sm">الشرائح</strong><span className="text-xs text-stone-400">{document.slides.length}/{MAX_SLIDES}</span></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={document.slides.map((slide) => slide.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">{document.slides.map((slide, index) => <SortableSlideThumbnail key={slide.id} document={document} slide={slide} index={index} selected={slide.id === activeSlideId} assetUrls={assetUrls} onSelect={() => { setActiveSlide(slide.id); if (mobile) useEditorUiStore.getState().setOpenPanel("properties"); }} />)}</div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="grid grid-cols-3 gap-1 border-t border-stone-200 p-2">
        <Button type="button" variant="ghost" size="icon" aria-label="إضافة شريحة" disabled={!controls.canAdd} onClick={controls.add}><Plus /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="تكرار الشريحة" disabled={!activeSlideId || !controls.canAdd} onClick={controls.duplicate}><CopyPlus /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="حذف الشريحة" disabled={!activeSlideId || !controls.canDelete} onClick={controls.remove}><Trash2 /></Button>
      </div>
      </>}
    </aside>
  );
}
