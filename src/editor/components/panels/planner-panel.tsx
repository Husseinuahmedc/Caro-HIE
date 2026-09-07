"use client";

import { flattenLayers } from "@/core/document";
import { findLayerContext } from "@/core/engine";
import { editLayerContent } from "@/core/engine/edit-content";
import { applySlideOperation } from "@/editor/commands";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button, Input, Label, Textarea } from "@/shared/ui";

export function PlannerPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const setOpenPanel = useEditorUiStore((state) => state.setOpenPanel);

  function edit(slideId: string, layerId: string, value: string) {
    session.update((current) => applySlideOperation(current, slideId, (slide) => editLayerContent(slide, layerId, value)), { label: "تعديل محتوى السلسلة", kind: "content", affectedIds: [layerId] });
  }

  return <div className="space-y-6">
    <p className="text-base leading-7 text-brand-muted">ابدأ بالعنوان الذي يشد القارئ، ثم فكرة واحدة لكل شريحة. تعديلاتك تظهر مباشرة في التصميم وتُحفظ تلقائياً.</p>
    <div className="grid gap-4 md:grid-cols-2">
      {document.slides.map((slide, index) => <section key={slide.id} className="space-y-4 rounded-lg border border-brand-border p-4">
        <h3 className="flex items-center gap-3 font-bold"><span className="grid size-8 place-items-center bg-primary text-sm text-white">{index + 1}</span>{slide.name}</h3>
        {flattenLayers(slide.layers).filter(({layer}) => layer.type === "text" || layer.type === "code").map(({layer}) => <div key={layer.id}>
          <Label htmlFor={`plan-${layer.id}-${slide.id}`}>{layer.name}</Label>
          {layer.type === "text" ? <Textarea id={`plan-${layer.id}-${slide.id}`} dir={layer.direction} disabled={layer.locked || findLayerContext(slide.layers, layer.id)?.parentLocked} value={layer.content} onChange={(event) => edit(slide.id, layer.id, event.target.value)} /> :
            layer.type === "code" ? <Textarea id={`plan-${layer.id}-${slide.id}`} dir="ltr" className="font-mono" disabled={layer.locked || findLayerContext(slide.layers, layer.id)?.parentLocked} value={layer.code} onChange={(event) => edit(slide.id, layer.id, event.target.value)} /> : null}
        </div>)}
        {!slide.layers.length ? <p className="text-sm text-brand-muted">شريحة فارغة. أضف نصاً من المحرر للكتابة هنا.</p> : null}
      </section>)}
    </div>
    <details className="border-t border-brand-border pt-4">
      <summary className="cursor-pointer text-sm font-bold">ملاحظات الكتابة الخاصة بك</summary>
      <p className="my-3 text-sm text-brand-muted">للتخطيط فقط؛ لا تُضاف إلى الشرائح أو تغيّر النص تلقائياً.</p>
      <div className="grid gap-4 sm:grid-cols-2">{([["goal", "الهدف"], ["audience", "الجمهور"], ["hook", "الفكرة الافتتاحية"], ["tone", "نبرة الكتابة"]] as const).map(([field, label]) => <div key={field}><Label htmlFor={`overview-${field}`}>{label}</Label><Input id={`overview-${field}`} value={document.contentPlan[field]} onChange={(event) => session.update((current) => ({ ...current, contentPlan: { ...current.contentPlan, [field]: event.target.value } }), {label: "تعديل ملاحظات الكتابة", kind: "content"})} /></div>)}</div>
    </details>
    <div className="sticky -bottom-5 flex justify-end border-t border-brand-border bg-surface-strong py-4">
      <Button variant="accent" onClick={() => setOpenPanel("properties")}>متابعة إلى التصميم</Button>
    </div>
  </div>;
}
