"use client";

import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Dialog } from "@/shared/ui/dialog";
import { BrandPanel } from "../panels/brand-panel";
import { PlannerPanel } from "../panels/planner-panel";
import { PreflightPanel } from "../panels/preflight-panel";
import { SlideSidebar } from "../slides/slide-sidebar";

const shortcuts = [
  ["Ctrl / ⌘ + Z", "تراجع"], ["Ctrl / ⌘ + Shift + Z", "إعادة"],
  ["Ctrl / ⌘ + S", "حفظ الآن"], ["Ctrl / ⌘ + D", "تكرار العنصر"],
  ["Shift + نقر", "تحديد عدة عناصر"], ["Ctrl / ⌘ + G", "تجميع"],
  ["Ctrl / ⌘ + Shift + G", "فك المجموعة"], ["الأسهم / Shift + الأسهم", "تحريك 1 / 10 بكسل"],
  ["Delete", "حذف العنصر"], ["Escape", "إنهاء التحرير أو إلغاء التحديد"],
];

export function WorkspacePanels() {
  const panel = useEditorUiStore((state) => state.openPanel);
  const setPanel = useEditorUiStore((state) => state.setOpenPanel);
  const titles = { planner: "محتوى السلسلة", brand: "هوية التصميم", preflight: "فحص قبل النشر", help: "دليل المحرر", navigation: "الشرائح والطبقات" };
  const modal = panel in titles ? panel as keyof typeof titles : null;
  return <Dialog open={modal !== null} onOpenChange={(open) => { if (!open) setPanel("properties"); }} title={modal ? titles[modal] : ""} wide={modal === "planner" || modal === "brand"}>
    {modal === "planner" ? <PlannerPanel /> : null}
    {modal === "brand" ? <BrandPanel /> : null}
    {modal === "preflight" ? <PreflightPanel /> : null}
    {modal === "navigation" ? <SlideSidebar mobile /> : null}
    {modal === "help" ? <div className="space-y-6">
      <ol className="list-inside list-decimal space-y-3 leading-7">
        <li>اكتب السلسلة من «المحتوى»، ثم انتقل إلى التصميم.</li>
        <li>انقر مرتين على النص للكتابة داخله. اسحب العنصر لتحريكه.</li>
        <li>استخدم «الشرائح» و«الطبقات» للترتيب والقفل والتحديد.</li>
        <li>على الهاتف، افتح «خصائص» لتعديل العنصر المحدد، وأغلق اللوحة للمعاينة.</li>
        <li>راجع الفحص ثم صدّر السلسلة. نزّل نسخة احتياطية لحماية مشروعك.</li>
      </ol>
      <table className="w-full text-sm"><caption className="mb-3 text-right font-bold">اختصارات لوحة المفاتيح</caption><tbody>{shortcuts.map(([key, label]) => <tr key={key} className="border-b border-brand-border"><td className="py-3">{label}</td><td dir="ltr" className="text-left">{key}</td></tr>)}</tbody></table>
    </div> : null}
  </Dialog>;
}
