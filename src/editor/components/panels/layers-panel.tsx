/* eslint-disable react-hooks/refs -- dnd-kit exposes callback refs and animated values during render. */
"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  BringToFront,
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  SendToBack,
  Unlock,
} from "lucide-react";

import type { Layer } from "@/core/document";
import {
  changeLayerOrder,
  changeLayerPosition,
  toggleLock,
  toggleVisibility,
} from "@/editor/commands";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";

interface PanelLayerEntry {
  layer: Layer;
  depth: number;
  parentId: string | null;
  orderingLocked: boolean;
}

function listLayersFrontToBack(
  layers: Layer[],
  depth = 0,
  parentId: string | null = null,
  parentLocked = false,
): PanelLayerEntry[] {
  return [...layers].reverse().flatMap((layer) => [
    { layer, depth, parentId, orderingLocked: parentLocked || layer.locked },
    ...(layer.type === "group"
      ? listLayersFrontToBack(layer.children, depth + 1, layer.id, parentLocked || layer.locked)
      : []),
  ]);
}

function SortableLayerRow({
  entry,
  selected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
}: {
  entry: PanelLayerEntry;
  selected: boolean;
  onSelect: (additive: boolean) => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
}) {
  const { layer, depth } = entry;
  const sortable = useSortable({ id: layer.id, disabled: entry.orderingLocked });

  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        marginInlineStart: depth * 12,
        opacity: sortable.isDragging ? 0.45 : 1,
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className={`flex items-center gap-1 rounded-xl border px-1.5 py-1.5 ${
        sortable.isOver
          ? "border-brand-accent ring-2 ring-brand-accent/20"
          : selected
            ? "border-brand-accent bg-brand-accent-soft"
            : "border-transparent hover:bg-stone-50"
      }`}
    >
      <button
        type="button"
        aria-label={`سحب طبقة ${layer.name}`}
        title={entry.orderingLocked ? "افتح قفل الطبقة أو مجموعتها لترتيبها" : "اسحب لإعادة الترتيب"}
        disabled={entry.orderingLocked}
        className="grid size-7 shrink-0 cursor-grab place-items-center rounded-lg text-stone-300 hover:bg-white hover:text-stone-600 disabled:cursor-not-allowed disabled:opacity-40"
        {...sortable.attributes}
        {...sortable.listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <button
        type="button"
        aria-pressed={selected}
        className="min-w-0 flex-1 truncate text-right text-xs font-semibold text-stone-700"
        onClick={(event) => onSelect(event.shiftKey)}
      >
        {layer.name}
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        aria-label={layer.visible ? `إخفاء ${layer.name}` : `إظهار ${layer.name}`}
        onClick={onToggleVisibility}
      >
        {layer.visible ? <Eye /> : <EyeOff />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7"
        aria-label={layer.locked ? `فتح قفل ${layer.name}` : `قفل ${layer.name}`}
        onClick={onToggleLock}
      >
        {layer.locked ? <Lock /> : <Unlock />}
      </Button>
    </div>
  );
}

export function LayersPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId) ?? document.slides[0]?.id;
  const selectedIds = useEditorUiStore((state) => state.selectedLayerIds);
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  const slide = document.slides.find((entry) => entry.id === activeSlideId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  if (!slide) return null;
  const entries = listLayersFrontToBack(slide.layers);
  const selectedLayerId = selectedIds.length === 1 ? selectedIds[0] : null;

  function onDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId || activeId === overId) return;
    const active = entries.find((entry) => entry.layer.id === activeId);
    const over = entries.find((entry) => entry.layer.id === overId);
    if (!active || !over || active.parentId !== over.parentId) return;
    changeLayerPosition(session, slide.id, activeId, overId);
    selectLayer(activeId);
  }

  function changeOrder(action: "forward" | "backward" | "front" | "back") {
    if (!selectedLayerId) return;
    changeLayerOrder(session, slide.id, selectedLayerId, action);
  }

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-stone-500">الطبقة الأعلى تظهر في المقدمة</p>
        <div className="flex items-center gap-0.5 rounded-xl border border-stone-200 bg-white p-0.5">
          <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="إلى المقدمة" title="إلى المقدمة" disabled={!selectedLayerId} onClick={() => changeOrder("front")}><BringToFront /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="للأمام خطوة" title="للأمام خطوة" disabled={!selectedLayerId} onClick={() => changeOrder("forward")}><ArrowUp /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="للخلف خطوة" title="للخلف خطوة" disabled={!selectedLayerId} onClick={() => changeOrder("backward")}><ArrowDown /></Button>
          <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="إلى الخلف بالكامل" title="إلى الخلف بالكامل" disabled={!selectedLayerId} onClick={() => changeOrder("back")}><SendToBack /></Button>
        </div>
      </div>

      {entries.length ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={entries.map((entry) => entry.layer.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {entries.map((entry) => (
                <SortableLayerRow
                  key={entry.layer.id}
                  entry={entry}
                  selected={selectedIds.includes(entry.layer.id)}
                  onSelect={(additive) => selectLayer(entry.layer.id, additive)}
                  onToggleVisibility={() => toggleVisibility(session, slide.id, entry.layer.id)}
                  onToggleLock={() => toggleLock(session, slide.id, entry.layer.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="p-6 text-center text-sm text-stone-400">لا توجد طبقات في هذه الشريحة.</p>
      )}
    </div>
  );
}
