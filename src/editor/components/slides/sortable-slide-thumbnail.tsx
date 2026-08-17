/* eslint-disable react-hooks/refs -- dnd-kit intentionally exposes callback refs and animated values during render. */
"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

import { getFramePreset, type ProjectDocument, type SlideDocument } from "@/core/document";
import { SlideRenderer } from "@/renderer";

interface SortableSlideThumbnailProps {
  document: ProjectDocument;
  slide: SlideDocument;
  index: number;
  selected: boolean;
  assetUrls: ReadonlyMap<string, string>;
  onSelect: () => void;
}

export function SortableSlideThumbnail({ document, slide, index, selected, assetUrls, onSelect }: SortableSlideThumbnailProps) {
  const sortable = useSortable({ id: slide.id });
  const frame = getFramePreset(document.framePresetId);
  const scale = 88 / frame.width;
  return (
    <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition, opacity: sortable.isDragging ? 0.5 : 1 }} className="relative flex gap-2">
      <button type="button" aria-label={`سحب الشريحة ${index + 1}`} className="mt-3 cursor-grab text-stone-300 hover:text-stone-600" {...sortable.attributes} {...sortable.listeners}><GripVertical className="size-4" /></button>
      <button type="button" onClick={onSelect} className={`min-w-0 flex-1 rounded-xl border p-2 text-right outline-none transition focus-visible:ring-2 focus-visible:ring-brand-ring ${selected ? "border-brand-accent bg-brand-accent-soft ring-2 ring-brand-accent/25" : "border-brand-border bg-surface-strong hover:border-primary/25"}`}>
        <div className="flex items-center gap-2">
          <span className="w-5 text-center text-xs font-bold text-stone-400">{index + 1}</span>
          <div className="overflow-hidden rounded-lg bg-stone-100 shadow-inner" style={{ width: 88, height: frame.height * scale }}>
            <div style={{ width: frame.width, height: frame.height, transform: `scale(${scale})`, transformOrigin: "top left" }} dir="ltr">
              <SlideRenderer document={document} slide={slide} assetUrls={assetUrls} />
            </div>
          </div>
        </div>
        <span className="mt-2 block truncate pr-7 text-xs font-bold text-stone-700">{slide.name}</span>
      </button>
    </div>
  );
}
