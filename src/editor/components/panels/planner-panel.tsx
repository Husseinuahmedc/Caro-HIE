"use client";

import { WandSparkles } from "lucide-react";

import { applyContentPlan } from "@/core/templates";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { Button, Input, Label, Textarea } from "@/shared/ui";

export function PlannerPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();

  function patchOverview(field: "goal" | "audience" | "hook" | "tone", value: string) {
    session.update((current) => ({ ...current, contentPlan: { ...current.contentPlan, [field]: value } }), { label: "تعديل خطة المحتوى", kind: "content" });
  }

  function patchSlide(index: number, field: "title" | "body" | "code", value: string) {
    session.update((current) => ({
      ...current,
      contentPlan: {
        ...current.contentPlan,
        slides: current.contentPlan.slides.map((slide, slideIndex) => slideIndex === index ? { ...slide, [field]: value } : slide),
      },
    }), { label: "تعديل محتوى شريحة", kind: "content", affectedIds: [currentPlanId(document, index)] });
  }

  return (
    <div className="space-y-5 p-4">
      <div><h3 className="font-black">مخطط المحتوى</h3><p className="mt-1 text-xs leading-5 text-stone-500">حرّر الفكرة أولاً ثم طبّقها على الطبقات الدلالية في خطوة واحدة.</p></div>
      <div><Label>الهدف</Label><Input value={document.contentPlan.goal} onChange={(event) => patchOverview("goal", event.target.value)} /></div>
      <div><Label>الجمهور</Label><Input value={document.contentPlan.audience} onChange={(event) => patchOverview("audience", event.target.value)} /></div>
      <div><Label>الـHook</Label><Input value={document.contentPlan.hook} onChange={(event) => patchOverview("hook", event.target.value)} /></div>
      <div><Label>النبرة</Label><Input value={document.contentPlan.tone} onChange={(event) => patchOverview("tone", event.target.value)} /></div>
      <div className="space-y-3 border-t border-stone-200 pt-4">
        {document.contentPlan.slides.map((item, index) => (
          <details key={item.id} className="rounded-xl border border-stone-200 bg-stone-50 p-3" open={index === 0}>
            <summary className="cursor-pointer text-sm font-bold">{index + 1}. {item.label}</summary>
            <div className="mt-3 space-y-3"><div><Label>العنوان</Label><Input value={item.title} onChange={(event) => patchSlide(index, "title", event.target.value)} /></div><div><Label>النص</Label><Textarea value={item.body} onChange={(event) => patchSlide(index, "body", event.target.value)} /></div>{item.code !== undefined ? <div><Label>الكود</Label><Textarea dir="ltr" className="font-mono text-left" value={item.code} onChange={(event) => patchSlide(index, "code", event.target.value)} /></div> : null}</div>
          </details>
        ))}
      </div>
      <Button type="button" variant="accent" className="w-full" onClick={() => session.update(applyContentPlan, { label: "تطبيق خطة المحتوى", kind: "content" })}><WandSparkles /> تطبيق الخطة على التصميم</Button>
    </div>
  );
}

function currentPlanId(document: ReturnType<typeof useProjectDocument>, index: number): string {
  return document.contentPlan.slides[index]?.id ?? String(index);
}
