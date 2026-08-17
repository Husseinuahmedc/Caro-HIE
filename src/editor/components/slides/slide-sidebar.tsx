"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CopyPlus, Plus, Trash2 } from "lucide-react";

import { MAX_SLIDES } from "@/core/document";
import { useSlideControls } from "@/editor/hooks/use-slide-controls";
import { Button } from "@/shared/ui";
import { useEditorAssets } from "../workspace/editor-assets-context";
import { SortableSlideThumbnail } from "./sortable-slide-thumbnail";

export function SlideSidebar() {
  const controls = useSlideControls();
  const { document, activeSlideId, setActiveSlide } = controls;
  const { assetUrls } = useEditorAssets();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function onDragEnd(event: DragEndEvent) {
    if (!event.over) return;
    controls.reorder(String(event.active.id), String(event.over.id));
  }

  return (
    <aside className="hidden w-44 shrink-0 flex-col border-l border-brand-border bg-surface lg:flex xl:w-52">
      <div className="flex h-12 items-center justify-between border-b border-stone-200 px-3"><strong className="text-sm">الشرائح</strong><span className="text-xs text-stone-400">{document.slides.length}/{MAX_SLIDES}</span></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={document.slides.map((slide) => slide.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">{document.slides.map((slide, index) => <SortableSlideThumbnail key={slide.id} document={document} slide={slide} index={index} selected={slide.id === activeSlideId} assetUrls={assetUrls} onSelect={() => setActiveSlide(slide.id)} />)}</div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="grid grid-cols-3 gap-1 border-t border-stone-200 p-2">
        <Button type="button" variant="ghost" size="icon" aria-label="إضافة شريحة" disabled={!controls.canAdd} onClick={controls.add}><Plus /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="تكرار الشريحة" disabled={!activeSlideId || !controls.canAdd} onClick={controls.duplicate}><CopyPlus /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="حذف الشريحة" disabled={!activeSlideId || !controls.canDelete} onClick={controls.remove}><Trash2 /></Button>
      </div>
    </aside>
  );
}
