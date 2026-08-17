"use client";

import { FileArchive, FileImage, FileJson, FileType2, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";

function safeFilename(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-") || "carousel";
}

export function ExportActions() {
  const document = useProjectDocument();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const slide = document.slides.find((entry) => entry.id === activeSlideId) ?? document.slides[0];
  const baseName = safeFilename(document.name);

  async function run(kind: "json" | "svg" | "png" | "pdf") {
    if (!slide) return;
    setError(null);
    setBusy(kind);
    try {
      const { downloadBlob } = await import("@/export/shared/download-blob");
      if (kind === "json") {
        const { exportProjectAsJson } = await import("@/export/json/export-json");
        downloadBlob(exportProjectAsJson(document), `${baseName}.json`);
      } else if (kind === "svg") {
        const { exportSlideAsSvg } = await import("@/export/svg/export-svg");
        downloadBlob(await exportSlideAsSvg(document, slide), `${baseName}-${document.slides.indexOf(slide) + 1}.svg`);
      } else if (kind === "png") {
        const { exportSlideAsPng } = await import("@/export/png/export-png");
        downloadBlob(await exportSlideAsPng(document, slide), `${baseName}-${document.slides.indexOf(slide) + 1}.png`);
      } else {
        const { exportProjectAsPdf } = await import("@/export/pdf/export-pdf");
        downloadBlob(await exportProjectAsPdf(document), `${baseName}.pdf`);
      }
    } catch {
      setError("تعذر التصدير. تحقق من اتصالك ثم أعد المحاولة.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={`flex items-center gap-0.5 rounded-xl border bg-surface-strong p-1 ${error ? "border-red-300" : "border-brand-border"}`} aria-busy={busy !== null} title={error ?? "خيارات التصدير"}>
      <ExportButton kind="json" busy={busy} label="JSON" icon={FileJson} onRun={run} />
      <ExportButton kind="svg" busy={busy} label="SVG" icon={FileType2} onRun={run} />
      <ExportButton kind="png" busy={busy} label="PNG" icon={FileImage} onRun={run} />
      <ExportButton kind="pdf" busy={busy} label="PDF" icon={FileArchive} onRun={run} />
      <span className="sr-only" aria-live="polite">{error ?? (busy ? `جارٍ تصدير ${busy.toUpperCase()}` : "")}</span>
    </div>
  );
}

function ExportButton({ kind, busy, label, icon: Icon, onRun }: { kind: "json" | "svg" | "png" | "pdf"; busy: string | null; label: string; icon: typeof FileJson; onRun: (kind: "json" | "svg" | "png" | "pdf") => Promise<void> }) {
  return <Button type="button" variant="ghost" size="icon" title={label} aria-label={`تصدير ${label}`} disabled={busy !== null} onClick={() => void onRun(kind)}>{busy === kind ? <LoaderCircle className="animate-spin" /> : <Icon />}</Button>;
}
