import { useState } from "react";
import { Archive, ArrowRight, Focus, Grid2X2, Redo2, Undo2, ZoomIn, ZoomOut, Maximize, SlidersHorizontal, PanelsTopLeft } from "lucide-react";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import type { AutosaveStatus } from "@/editor/hooks/use-project-autosave";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";
import { ExportActions } from "./export-actions";
import { getFramePreset } from "@/core/document";

const STATUS_LABELS: Record<AutosaveStatus, string> = { saved: "محفوظ في هذا المتصفح", saving: "جارٍ الحفظ…", pending: "بانتظار الحفظ…", error: "تعذر الحفظ" };

interface EditorTopbarProps {
  status: AutosaveStatus;
  errorMessage: string | null;
  onSave: () => Promise<void>;
  onExit: () => Promise<void>;
}

export function EditorTopbar({ status, errorMessage, onSave, onExit }: EditorTopbarProps) {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const ui = useEditorUiStore();
  const frame = getFramePreset(document.framePresetId);
  const [backupBusy, setBackupBusy] = useState(false);

  async function downloadBackup() {
    if (backupBusy) return;
    setBackupBusy(true);
    try {
      const { exportProjectBackup } = await import("@/storage/recovery/project-backup");
      const { downloadBlob } = await import("@/export/shared/download-blob");
      const blob = await exportProjectBackup(document);
      const baseName = document.name.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-") || "carousel";
      downloadBlob(blob, `${baseName}-backup.json`);
    } finally {
      setBackupBusy(false);
    }
  }

  function fit() {
    const canvas = window.document.querySelector("[data-editor-canvas]");
    if (!canvas) return;
    ui.setZoom(Math.min((canvas.clientWidth - 48) / frame.width, (canvas.clientHeight - 110) / frame.height, 1));
  }

  return <header className="z-30 shrink-0 border-b border-brand-border bg-surface-strong text-primary">
    <div className="flex min-h-16 items-center gap-2 px-2 sm:px-4">
      <Button variant="ghost" size="icon" aria-label="العودة إلى المشاريع" title="المشاريع" onClick={() => void onExit()}><ArrowRight /></Button>
      <span className="hidden border-l border-brand-border pl-4 text-sm font-black xl:block">Carousel Studio <span className="text-brand-accent-strong">II</span></span>
      <div className="min-w-0 flex-1">
        <input aria-label="اسم المشروع" maxLength={80} value={document.name} onChange={(event) => session.update((current) => ({ ...current, name: event.target.value }), { label: "تسمية المشروع", kind: "content" })} onBlur={() => { if (!document.name.trim()) session.update((current) => ({...current, name: "مشروع بلا عنوان"}), {label: "تسمية المشروع", kind: "content"}); }} className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm font-bold hover:border-brand-border focus:border-brand-ring focus:outline-none" />
        <p role="status" className={`px-2 text-xs ${status === "error" ? "text-red-700" : "text-brand-muted"}`}>{STATUS_LABELS[status]}</p>
      </div>
      <nav className="hidden items-center gap-1 md:flex" aria-label="خطوات العمل">
        <Button variant="ghost" size="sm" onClick={() => ui.setOpenPanel("planner")}>المحتوى</Button>
        <Button variant="ghost" size="sm" onClick={() => ui.setOpenPanel("brand")}>الهوية</Button>
        <Button variant="ghost" size="sm" onClick={() => ui.setOpenPanel("preflight")}>الفحص</Button>
        <Button variant="ghost" size="sm" onClick={() => ui.setOpenPanel("help")}>الدليل</Button>
      </nav>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={backupBusy}
          onClick={() => void downloadBackup()}
          title="تنزيل نسخة احتياطية شاملة تشمل التصميم والصور"
          aria-label="نسخة احتياطية"
        >
          <Archive className="size-4" />
          <span className="hidden sm:inline">نسخة احتياطية</span>
        </Button>
        <ExportActions />
      </div>
    </div>
    {status === "error" ? <div role="alert" className="flex items-center justify-between gap-3 bg-red-50 px-4 py-2 text-sm text-red-800"><span>{errorMessage ?? "لم يُحفظ آخر تعديل. احتفظ بنسخة احتياطية قبل المغادرة."}</span><button onClick={() => void onSave()} className="shrink-0 underline">إعادة الحفظ</button></div> : null}
    <div className="flex items-center gap-1 overflow-x-auto border-t border-brand-border px-2 py-1">
      <Button variant="ghost" size="icon" aria-label="الشرائح والطبقات" title="الشرائح والطبقات" className="lg:hidden" onClick={() => ui.setOpenPanel("navigation")}><PanelsTopLeft /></Button>
      <Button variant="ghost" size="icon" aria-label="تراجع" title="تراجع — Ctrl+Z" disabled={!session.canUndo} onClick={() => session.undo()}><Undo2 /></Button>
      <Button variant="ghost" size="icon" aria-label="إعادة" title="إعادة — Ctrl+Shift+Z" disabled={!session.canRedo} onClick={() => session.redo()}><Redo2 /></Button>
      <span className="mx-1 h-5 w-px shrink-0 bg-brand-border" />
      <Button variant="ghost" size="icon" aria-label="تصغير" title="تصغير" onClick={() => ui.setZoom(ui.zoom - 0.05)}><ZoomOut /></Button>
      <span className="min-w-10 text-center text-xs tabular-nums">{Math.round(ui.zoom * 100)}%</span>
      <Button variant="ghost" size="icon" aria-label="تكبير" title="تكبير" onClick={() => ui.setZoom(ui.zoom + 0.05)}><ZoomIn /></Button>
      <Button variant="ghost" size="icon" aria-label="ملاءمة الشاشة" title="ملاءمة الشاشة" onClick={fit}><Maximize /></Button>
      <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="المنطقة الآمنة" title="المنطقة الآمنة" aria-pressed={ui.showSafeArea} onClick={ui.toggleSafeArea}><Grid2X2 /></Button>
      <Button variant="ghost" size="icon" className="hidden lg:inline-flex" aria-label="وضع التركيز" title="وضع التركيز" aria-pressed={ui.focusMode} onClick={ui.toggleFocusMode}><Focus /></Button>
      <Button variant="secondary" size="sm" className="ms-auto lg:hidden" onClick={() => ui.setInspectorOpen(true)}><SlidersHorizontal />خصائص</Button>
    </div>
    <nav className="grid grid-cols-4 border-t border-brand-border md:hidden" aria-label="خطوات العمل على الهاتف">
      {([["planner", "المحتوى"], ["brand", "الهوية"], ["preflight", "الفحص"], ["help", "الدليل"]] as const).map(([panel, label]) => <button key={panel} className="min-h-11 px-2 text-sm font-semibold hover:bg-background" onClick={() => ui.setOpenPanel(panel)}>{label}</button>)}
    </nav>
  </header>;
}
