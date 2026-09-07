"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { getFramePreset } from "@/core/document";
import { runPreflight } from "@/core/preflight";
import { useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { SlideRenderer } from "@/renderer";
import { Button, Select } from "@/shared/ui";
import { Dialog } from "@/shared/ui/dialog";
import { useEditorAssets } from "../workspace/editor-assets-context";

function safeFilename(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-") || "carousel";
}

export function ExportActions() {
  const document = useProjectDocument();
  const { assetUrls } = useEditorAssets();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId);
  const setOpenPanel = useEditorUiStore((state) => state.setOpenPanel);
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"png" | "svg" | "pdf">("png");
  const [scope, setScope] = useState("all");
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const slide = document.slides.find((entry) => entry.id === activeSlideId) ?? document.slides[0];
  const frame = getFramePreset(document.framePresetId);
  const issues = runPreflight(document);
  const baseName = safeFilename(document.name);
  const selected = scope === "all" ? document.slides : slide ? [slide] : [];

  async function run(kind: "design" | "backup" | "json") {
    if (busy) return;
    setBusy(true); setError(""); setMessage("جارٍ تجهيز الملف…");
    try {
      const { downloadBlob } = await import("@/export/shared/download-blob");
      if (kind === "backup") {
        const { exportProjectBackup } = await import("@/storage/recovery/project-backup");
        downloadBlob(await exportProjectBackup(document), `${baseName}-backup.json`);
      } else if (kind === "json") {
        const { exportProjectAsJson } = await import("@/export/json/export-json");
        downloadBlob(exportProjectAsJson(document), `${baseName}.json`);
      } else if (format === "pdf") {
        const { exportProjectAsPdf } = await import("@/export/pdf/export-pdf");
        downloadBlob(await exportProjectAsPdf({...document, slides: selected}), `${baseName}.pdf`);
      } else {
        const entries = [];
        for (const [index, item] of selected.entries()) {
          setMessage(`تجهيز الشريحة ${index + 1} من ${selected.length}…`);
          const blob = format === "png"
            ? await (await import("@/export/png/export-png")).exportSlideAsPng(document, item, scale)
            : await (await import("@/export/svg/export-svg")).exportSlideAsSvg(document, item);
          entries.push({name: `${baseName}-${String(document.slides.indexOf(item) + 1).padStart(2, "0")}.${format}`, blob});
        }
        if (entries.length === 1) downloadBlob(entries[0]!.blob, entries[0]!.name);
        else {
          const { createZip } = await import("@/export/shared/zip");
          downloadBlob(await createZip(entries), `${baseName}-${format}.zip`);
        }
      }
      setMessage("الملف جاهز. بدأ التنزيل.");
    } catch (reason) {
      setMessage("");
      setError(reason instanceof Error ? `تعذر تجهيز الملف: ${reason.message}` : "تعذر تجهيز الملف. حاول بجودة أقل أو صدّر شريحة واحدة.");
    } finally { setBusy(false); }
  }

  return <>
    <Button variant="accent" onClick={() => { setOpen(true); setMessage(""); setError(""); }}><Download /><span>تصدير</span></Button>
    <Dialog open={open} onOpenChange={(value) => { if (!busy) setOpen(value); }} title="تصدير السلسلة" description="اختر الشرائح والصيغة. ملفات الصور المتعددة تُجمع في ملف ZIP واحد.">
      <div className="space-y-5">
        {slide ? <div className="flex items-center gap-4 rounded-lg bg-background p-3">
          <div className="relative shrink-0 overflow-hidden" style={{width: 88, height: 88 * frame.height / frame.width}}>
            <div className="absolute left-0 top-0 origin-top-left" style={{transform: `scale(${88 / frame.width})`}} dir="ltr"><SlideRenderer document={document} slide={slide} assetUrls={assetUrls} /></div>
          </div>
          <div><p className="font-bold">{document.name}</p><p className="mt-1 text-sm text-brand-muted">{selected.length} شرائح · {frame.label}</p><p className="text-sm text-brand-muted" dir="ltr">{frame.width * (format === "png" ? scale : 1)} × {frame.height * (format === "png" ? scale : 1)} px</p></div>
        </div> : null}
        <fieldset disabled={busy} className="space-y-4">
          <label className="block text-sm font-semibold">الصيغة<Select aria-label="الصيغة" className="mt-2" value={format} onChange={(event) => setFormat(event.target.value as typeof format)}><option value="png">PNG — صور جاهزة للنشر</option><option value="pdf">PDF — ملف متعدد الصفحات</option><option value="svg">SVG — ملفات متجهية</option></Select></label>
          <label className="block text-sm font-semibold">الشرائح<Select aria-label="الشرائح" className="mt-2" value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">كل الشرائح ({document.slides.length})</option><option value="current">الشريحة الحالية فقط</option></Select></label>
          {format === "png" ? <label className="block text-sm font-semibold">الدقة<Select aria-label="الدقة" className="mt-2" value={scale} onChange={(event) => setScale(Number(event.target.value))}><option value={1}>الأصلية — مناسبة للنشر</option><option value={2}>مضاعفة — ملف أكبر</option></Select></label> : null}
        </fieldset>
        {issues.length ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><p>{issues.length} ملاحظات قبل النشر. يمكنك التصدير أو مراجعتها أولاً.</p><button disabled={busy} className="mt-2 min-h-11 font-bold underline" onClick={() => {setOpen(false); setOpenPanel("preflight");}}>مراجعة الملاحظات</button></div> : <p className="text-sm text-primary">لا توجد ملاحظات في الفحص الآلي.</p>}
        <Button disabled={busy || !selected.length} className="w-full" variant="accent" onClick={() => void run("design")}>{busy ? "جارٍ التصدير…" : "تنزيل الملفات"}</Button>
        <p role="status" className="text-sm text-brand-muted">{message}</p>
        {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
        <details className="border-t border-brand-border pt-4"><summary className="cursor-pointer text-sm font-bold">نسخة احتياطية وبيانات المشروع</summary>
          <p className="my-3 text-sm leading-6 text-brand-muted">النسخة الاحتياطية تشمل التصميم والصور، ويمكن استعادتها من صفحة المشاريع. JSON المجرّد يحتوي بيانات التصميم فقط.</p>
          <div className="flex flex-wrap gap-2"><Button variant="secondary" disabled={busy} onClick={() => void run("backup")}>تنزيل نسخة احتياطية</Button><Button variant="ghost" disabled={busy} onClick={() => void run("json")}>JSON بدون الصور</Button></div>
        </details>
      </div>
    </Dialog>
  </>;
}
