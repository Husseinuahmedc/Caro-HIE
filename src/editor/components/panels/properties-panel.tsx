"use client";

import { AlignCenter, AlignHorizontalDistributeCenter, AlignLeft, AlignRight, BringToFront, Copy, Group, Lock, SendToBack, Trash2, Ungroup, Unlock } from "lucide-react";

import { getLayer, type Layer } from "@/core/document";
import { alignLayers, distributeLayers, patchLayer } from "@/core/engine";
import { changeLayerOrder, duplicateOneLayer, groupSelection, removeLayers, ungroupSelection } from "@/editor/commands";
import { applySlideOperation } from "@/editor/commands/document-operations";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { storeAsset } from "@/storage";
import { Button, Input, Label, Select, Textarea } from "@/shared/ui";
import { FontPicker } from "../fonts/font-picker";
import { useEditorAssets } from "../workspace/editor-assets-context";

function NumberField({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <div><Label>{label}</Label><Input type="number" value={Number.isInteger(value) ? value : Number(value.toFixed(2))} min={min} max={max} step={step} dir="ltr" onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

export function PropertiesPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const { reloadAssets } = useEditorAssets();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId) ?? document.slides[0]?.id;
  const selectedIds = useEditorUiStore((state) => state.selectedLayerIds);
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  const clearSelection = useEditorUiStore((state) => state.clearSelection);
  const slide = document.slides.find((entry) => entry.id === activeSlideId);
  const layer = slide && selectedIds.length === 1 ? getLayer(slide.layers, selectedIds[0] ?? "") : null;

  function applyOperation(operation: Parameters<typeof applySlideOperation>[2], label: string) {
    if (!slide) return;
    session.update((current) => applySlideOperation(current, slide.id, operation), { label, kind: "layer", affectedIds: selectedIds });
  }

  function patch(patchValue: Partial<Layer>, label = "تعديل خصائص العنصر") {
    if (!slide || !layer) return;
    applyOperation((currentSlide) => patchLayer(currentSlide, layer.id, patchValue), label);
  }

  if (!slide || !selectedIds.length) {
    return <div className="grid min-h-56 place-items-center p-6 text-center text-sm leading-6 text-stone-500">اختر عنصراً من الشريحة أو من قائمة الطبقات لتعديل خصائصه.</div>;
  }

  if (selectedIds.length > 1) {
    return (
      <div className="space-y-5 p-4">
        <div><h3 className="font-black">{selectedIds.length} عناصر محددة</h3><p className="mt-1 text-xs text-stone-500">رتّبها أو حاذها كعملية واحدة.</p></div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" size="icon" aria-label="محاذاة يمين" onClick={() => applyOperation((current) => alignLayers(current, selectedIds, "right", document.framePresetId), "محاذاة عناصر")}><AlignRight /></Button>
          <Button variant="secondary" size="icon" aria-label="توسيط" onClick={() => applyOperation((current) => alignLayers(current, selectedIds, "center-x", document.framePresetId), "محاذاة عناصر")}><AlignCenter /></Button>
          <Button variant="secondary" size="icon" aria-label="محاذاة يسار" onClick={() => applyOperation((current) => alignLayers(current, selectedIds, "left", document.framePresetId), "محاذاة عناصر")}><AlignLeft /></Button>
          <Button variant="secondary" size="icon" aria-label="توزيع أفقي" onClick={() => applyOperation((current) => distributeLayers(current, selectedIds, "horizontal"), "توزيع عناصر")}><AlignHorizontalDistributeCenter /></Button>
          <Button variant="secondary" className="col-span-2" onClick={() => { const id = groupSelection(session, slide.id, selectedIds); if (id) selectLayer(id); }}><Group /> تجميع</Button>
        </div>
      </div>
    );
  }

  if (!layer) return null;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between"><div><h3 className="font-black">{layer.name}</h3><span className="text-xs uppercase text-stone-400">{layer.type}</span></div><Button type="button" variant="ghost" size="icon" aria-label={layer.locked ? "فتح القفل" : "قفل العنصر"} onClick={() => patch({ locked: !layer.locked }, "تغيير القفل")}>{layer.locked ? <Lock /> : <Unlock />}</Button></div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField label="X" value={layer.x} onChange={(x) => patch({ x })} />
        <NumberField label="Y" value={layer.y} onChange={(y) => patch({ y })} />
        <NumberField label="العرض" value={layer.width} min={48} onChange={(width) => patch({ width })} />
        <NumberField label="الارتفاع" value={layer.height} min={48} onChange={(height) => patch({ height })} />
        <NumberField label="الدوران" value={layer.rotation} step={1} onChange={(rotation) => patch({ rotation })} />
        <NumberField label="الشفافية" value={layer.opacity} min={0} max={1} step={0.05} onChange={(opacity) => patch({ opacity })} />
      </div>

      {layer.type === "text" ? <>
        <div><Label>المحتوى</Label><Textarea value={layer.content} onChange={(event) => patch({ content: event.target.value } as Partial<Layer>, "تحرير النص")} /></div>
        <FontPicker label="الخط" value={layer.fontFamilyId} onChange={(fontFamilyId) => patch({ fontFamilyId } as Partial<Layer>)} />
        <div className="grid grid-cols-2 gap-3"><NumberField label="حجم الخط" value={layer.fontSize} min={8} onChange={(fontSize) => patch({ fontSize } as Partial<Layer>)} /><NumberField label="الوزن" value={layer.fontWeight} min={100} max={900} step={100} onChange={(fontWeight) => patch({ fontWeight } as Partial<Layer>)} /></div>
        <div className="grid grid-cols-2 gap-3"><div><Label>الاتجاه</Label><Select value={layer.direction} onChange={(event) => patch({ direction: event.target.value } as Partial<Layer>)}><option value="rtl">RTL</option><option value="ltr">LTR</option></Select></div><div><Label>اللون</Label><Input type="color" value={layer.color} onChange={(event) => patch({ color: event.target.value } as Partial<Layer>)} /></div></div>
      </> : null}

      {layer.type === "code" ? <>
        <div><Label>الكود</Label><Textarea dir="ltr" className="font-mono text-left" value={layer.code} onChange={(event) => patch({ code: event.target.value } as Partial<Layer>, "تحرير الكود")} /></div>
        <div className="grid grid-cols-2 gap-3"><NumberField label="حجم الخط" value={layer.fontSize} min={8} onChange={(fontSize) => patch({ fontSize } as Partial<Layer>)} /><NumberField label="الحواف" value={layer.radius} min={0} onChange={(radius) => patch({ radius } as Partial<Layer>)} /></div>
      </> : null}

      {layer.type === "shape" ? <div className="grid grid-cols-2 gap-3"><div><Label>التعبئة</Label><Input type="color" value={layer.fill} onChange={(event) => patch({ fill: event.target.value } as Partial<Layer>)} /></div><div><Label>الإطار</Label><Input type="color" value={layer.stroke} onChange={(event) => patch({ stroke: event.target.value } as Partial<Layer>)} /></div></div> : null}

      {layer.type === "image" ? <div><Label>ملف الصورة</Label><Input type="file" accept="image/*" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const asset = await storeAsset(document.id, file, file.name); patch({ assetId: asset.id } as Partial<Layer>, "إضافة صورة"); await reloadAssets(); }} /></div> : null}

      {layer.type === "group" ? <Button type="button" variant="secondary" className="w-full" onClick={() => { ungroupSelection(session, slide.id, layer.id); clearSelection(); }}><Ungroup /> فك المجموعة</Button> : null}

      <div className="grid grid-cols-5 gap-1 border-t border-stone-200 pt-4">
        <Button variant="ghost" size="icon" aria-label="إلى الأمام" onClick={() => changeLayerOrder(session, slide.id, layer.id, "front")}><BringToFront /></Button>
        <Button variant="ghost" size="icon" aria-label="إلى الخلف" onClick={() => changeLayerOrder(session, slide.id, layer.id, "back")}><SendToBack /></Button>
        <Button variant="ghost" size="icon" aria-label="تكرار" onClick={() => { const id = duplicateOneLayer(session, slide.id, layer.id); if (id) selectLayer(id); }}><Copy /></Button>
        <span />
        <Button variant="destructive" size="icon" aria-label="حذف" onClick={() => { removeLayers(session, slide.id, [layer.id]); clearSelection(); }}><Trash2 /></Button>
      </div>
    </div>
  );
}
