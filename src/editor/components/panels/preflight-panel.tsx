"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

import { runPreflight, type PreflightSeverity } from "@/core/preflight";
import { useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Badge } from "@/shared/ui";

const severityPresentation: Record<PreflightSeverity, { icon: typeof Info; className: string; label: string }> = {
  error: { icon: AlertCircle, className: "border-red-200 bg-red-50 text-red-800", label: "خطأ" },
  warning: { icon: AlertTriangle, className: "border-amber-200 bg-amber-50 text-amber-800", label: "تنبيه" },
  info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-800", label: "ملاحظة" },
};

export function PreflightPanel() {
  const document = useProjectDocument();
  const issues = runPreflight(document);
  const setActiveSlide = useEditorUiStore((state) => state.setActiveSlide);
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between"><div><h3 className="font-black">فحص قبل التصدير</h3><p className="mt-1 text-xs text-stone-500">{issues.length ? "راجع النقاط التالية." : "كل القواعد اجتازت الفحص."}</p></div><Badge>{issues.length}</Badge></div>
      {!issues.length ? <div className="grid min-h-44 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-center text-emerald-800"><div><CheckCircle2 className="mx-auto mb-2 size-8" /><strong>جاهز للتصدير</strong></div></div> : null}
      {issues.map((item) => {
        const presentation = severityPresentation[item.severity];
        const Icon = presentation.icon;
        return <button key={item.id} type="button" className={`flex w-full gap-3 rounded-xl border p-3 text-right ${presentation.className}`} onClick={() => { if (item.target.slideId) setActiveSlide(item.target.slideId); if (item.target.layerId) selectLayer(item.target.layerId); }}><Icon className="mt-0.5 size-4 shrink-0" /><span><strong className="block text-xs">{presentation.label}</strong><span className="mt-1 block text-xs leading-5">{item.message}</span></span></button>;
      })}
    </div>
  );
}
