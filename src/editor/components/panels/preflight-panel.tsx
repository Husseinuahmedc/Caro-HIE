"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { runPreflight, type PreflightIssue } from "@/core/preflight";
import { contrastRatio } from "@/core/preflight/color-contrast";
import { findLayerContext, patchLayer } from "@/core/engine";
import { applySlideOperation } from "@/editor/commands";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";

export function PreflightPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const issues = runPreflight(document);
  const [notice, setNotice] = useState("");
  const ui = useEditorUiStore();
  function locate(item: PreflightIssue) {
    if (item.target.slideId) ui.setActiveSlide(item.target.slideId);
    if (item.target.layerId) ui.selectLayer(item.target.layerId);
    ui.setOpenPanel("properties");
    if (window.innerWidth < 1024) ui.setInspectorOpen(true);
  }
  function fixContrast(item: PreflightIssue) {
    const {slideId, layerId} = item.target;
    if (!slideId || !layerId) return;
    const background = document.brand.colors.background;
    const color = contrastRatio("#19454b", background) >= 4.5 ? "#19454b"
      : contrastRatio("#ffffff", background) > contrastRatio("#111111", background) ? "#ffffff" : "#111111";
    session.update((current) => applySlideOperation(current, slideId, (slide) => patchLayer(slide, layerId, {color})), {label: "تحسين تباين النص", kind: "layer", affectedIds: [layerId]});
    setNotice("تم تحسين التباين. يمكنك التراجع لاستعادة اللون السابق.");
  }
  return <div className="space-y-4">
    <p role="status" className="text-sm text-brand-muted">{notice || (issues.length ? `${issues.length} ملاحظات تستحق المراجعة.` : "اجتاز التصميم الفحص الآلي. راجع المحتوى بصرياً قبل النشر.")}</p>
    {!issues.length ? <div className="flex items-center gap-3 rounded-lg bg-brand-accent-soft p-5"><CheckCircle2 /><strong>جاهز للتصدير</strong></div> : null}
    {issues.map((item) => {
      const slide = document.slides.find((entry) => entry.id === item.target.slideId);
      const context = slide && item.target.layerId ? findLayerContext(slide.layers, item.target.layerId) : null;
      const layer = context?.layer;
      return <article key={item.id} className="space-y-3 rounded-lg border border-brand-border p-4">
        <p className={`text-sm font-bold ${item.severity === "error" ? "text-red-700" : "text-primary"}`}>{slide ? `الشريحة ${document.slides.indexOf(slide) + 1}: ${slide.name}` : "السلسلة"}{layer ? ` / ${layer.name}` : ""}</p>
        <p className="text-sm leading-6">{item.message}</p>
        <div className="flex flex-wrap gap-2">
          {item.target.slideId ? <Button variant="secondary" onClick={() => locate(item)}>فتح العنصر</Button> : <Button variant="secondary" onClick={() => ui.setOpenPanel("navigation")}>فتح الشرائح</Button>}
          {item.ruleId === "contrast" && layer && !layer.locked && !context?.parentLocked ? <Button variant="accent" onClick={() => fixContrast(item)}>تحسين التباين</Button> : null}
        </div>
      </article>;
    })}
  </div>;
}
