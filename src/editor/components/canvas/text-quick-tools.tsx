"use client";

import { AlignCenter, AlignLeft, AlignRight, Bold, Pencil } from "lucide-react";
import type { TextLayer } from "@/core/document";
import { patchLayer } from "@/core/engine";
import { applySlideOperation } from "@/editor/commands";
import { useDocumentSession } from "@/editor/hooks/use-document-session";
import { Button } from "@/shared/ui";
import { EDITOR_FONT_REGISTRY } from "@/fonts";

export function TextQuickTools({ layer, slideId, onEdit }: { layer: TextLayer; slideId: string; onEdit: () => void }) {
  const session = useDocumentSession();
  function patch(value: Partial<TextLayer>) {
    session.update((current) => applySlideOperation(current, slideId, (slide) => patchLayer(slide, layer.id, value)), { label: "تنسيق النص", kind: "layer", affectedIds: [layer.id] });
  }
  return <div role="toolbar" aria-label="تنسيق النص" className="absolute -top-14 right-0 z-30 flex max-w-[calc(100vw-3rem)] items-center gap-1 overflow-x-auto rounded-lg border border-brand-border bg-white p-1 shadow-sm" onPointerDown={(event) => event.stopPropagation()}>
    <Button variant="ghost" size="icon" aria-label="تحرير النص" title="تحرير النص" onClick={onEdit}><Pencil /></Button>
    <select aria-label="خط النص السريع" value={layer.fontFamilyId} onChange={(event) => patch({fontFamilyId: event.target.value})} className="hidden h-11 max-w-32 rounded border border-brand-border px-2 text-sm xl:block">{EDITOR_FONT_REGISTRY.filter((font) => font.provider !== "system").map((font) => <option key={font.id} value={font.id}>{font.displayName}</option>)}</select>
    <input aria-label="حجم النص السريع" type="number" min={8} max={400} value={layer.fontSize} onChange={(event) => { const value = Number(event.target.value); if (value >= 8 && value <= 400) patch({fontSize: value}); }} className="h-11 w-16 rounded border border-brand-border px-2 text-sm" dir="ltr" />
    <Button variant="ghost" size="icon" aria-label="نص عريض" title="نص عريض" aria-pressed={layer.fontWeight >= 700} onClick={() => patch({fontWeight: layer.fontWeight >= 700 ? 400 : 700})}><Bold /></Button>
    {([['right', AlignRight, 'محاذاة يمين'], ['center', AlignCenter, 'محاذاة وسط'], ['left', AlignLeft, 'محاذاة يسار']] as const).map(([align, Icon, label]) => <Button key={align} variant="ghost" size="icon" aria-label={label} title={label} aria-pressed={layer.align === align} onClick={() => patch({align})}><Icon /></Button>)}
    <input aria-label="لون النص السريع" type="color" value={layer.color} onChange={(event) => patch({color: event.target.value})} className="h-11 w-11 shrink-0 cursor-pointer rounded border-0 bg-transparent p-1" />
  </div>;
}
