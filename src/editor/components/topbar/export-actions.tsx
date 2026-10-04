"use client";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getFramePreset } from "@/core/document";
import { runPreflight } from "@/core/preflight";
import { useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button, Input, Select } from "@/shared/ui";
import {
  exportSlideFilename,
  selectExportSlides,
} from "@/export/shared/export-job";
import { ArtworkPreview } from "../dashboard/artwork-preview";
import { useEditorAssets } from "../workspace/editor-assets-context";
function safeFilename(value: string) {
  return (
    value
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-") || "carousel"
  );
}
export function ExportActions({ panel = false }: { panel?: boolean }) {
  const document = useProjectDocument(),
    ui = useEditorUiStore(),
    { assetUrls } = useEditorAssets();
  const [format, setFormat] = useState<"png" | "svg" | "pdf">("png"),
    [scope, setScope] = useState("all"),
    [range, setRange] = useState("1-3"),
    [scale, setScale] = useState(1),
    [busy, setBusy] = useState(false),
    [completed, setCompleted] = useState(0),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [batches, setBatches] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const current =
    document.slides.find((slide) => slide.id === ui.activeSlideId) ??
    document.slides[0]!;
  const frame = getFramePreset(document.framePresetId, document.customFrame),
    issues = runPreflight(document),
    base = safeFilename(document.name);
  let selected = document.slides,
    rangeError = "";
  if (scope === "current") selected = [current];
  if (scope === "range")
    try {
      selected = selectExportSlides(document.slides, range);
    } catch (reason) {
      selected = [];
      rangeError = reason instanceof Error ? reason.message : "راجع النطاق.";
    }
  async function run(kind: "design" | "backup" | "json") {
    if (busy) return;
    const job = new AbortController();
    controller.current = job;
    setBusy(true);
    setCompleted(0);
    setError("");
    setMessage("جارٍ تجهيز الخطوط والصور…");
    try {
      const { downloadBlob } = await import("@/export/shared/download-blob");
      if (kind === "backup") {
        const { exportProjectBackup } =
          await import("@/storage/recovery/project-backup");
        const blob = await exportProjectBackup(document);
        job.signal.throwIfAborted();
        downloadBlob(blob, `${base}-backup.json`);
      } else if (kind === "json") {
        const { exportProjectAsJson } =
          await import("@/export/json/export-json");
        job.signal.throwIfAborted();
        downloadBlob(exportProjectAsJson(document), `${base}.json`);
      } else {
        const { prepareExportJob } = await import("@/export/shared/export-job");
        const resources = await prepareExportJob(document, job.signal);
        setMessage("جارٍ تجهيز الشرائح…");
        const groups = batches
          ? Array.from({ length: Math.ceil(selected.length / 20) }, (_, i) =>
              selected.slice(i * 20, i * 20 + 20),
            )
          : [selected];
        // Complete all groups before downloading any; cancellation produces no partial batch.
        const downloads: { blob: Blob; name: string }[] = [];
        let done = 0;
        for (const [groupIndex, group] of groups.entries()) {
          const suffix = batches ? `-part-${groupIndex + 1}` : "";
          if (format === "pdf") {
            const { exportProjectAsPdf } =
              await import("@/export/pdf/export-pdf");
            const offset = done;
            const blob = await exportProjectAsPdf(
              document,
              {
                slides: group,
                signal: job.signal,
                onProgress: (n) => setCompleted(offset + n),
              },
              resources,
            );
            done += group.length;
            downloads.push({ blob, name: `${base}${suffix}.pdf` });
          } else {
            const entries = [];
            for (const item of group) {
              job.signal.throwIfAborted();
              const blob =
                format === "png"
                  ? await (
                      await import("@/export/png/export-png")
                    ).exportSlideAsPng(document, item, scale, resources)
                  : await (
                      await import("@/export/svg/export-svg")
                    ).exportSlideAsSvg(document, item, resources);
              job.signal.throwIfAborted();
              entries.push({
                name: exportSlideFilename(
                  base,
                  document.slides.indexOf(item),
                  document.slides.length,
                  format,
                ),
                blob,
              });
              setCompleted(++done);
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
            if (entries.length === 1 && !batches) downloads.push(entries[0]!);
            else {
              const { createZip } = await import("@/export/shared/zip");
              downloads.push({
                blob: await createZip(entries),
                name: `${base}${suffix}-${format}.zip`,
              });
            }
          }
        }
        job.signal.throwIfAborted();
        if (downloads.length > 1) {
          const { createZip } = await import("@/export/shared/zip");
          downloadBlob(await createZip(downloads), `${base}-batches.zip`);
        } else if (downloads[0])
          downloadBlob(downloads[0].blob, downloads[0].name);
      }
      setMessage("الملف جاهز. بدأ التنزيل.");
    } catch (reason) {
      if (job.signal.aborted)
        setMessage("تم إلغاء التصدير. مشروعك محفوظ كما هو.");
      else {
        setMessage("");
        setError(
          reason instanceof Error
            ? `تعذر تجهيز الملف: ${reason.message}. جرّب دقة أقل أو نطاقاً أصغر.`
            : "تعذر تجهيز الملف. جرّب دقة أقل أو نطاقاً أصغر.",
        );
      }
    } finally {
      setBusy(false);
      controller.current = null;
    }
  }
  if (!panel)
    return (
      <Button variant="accent" onClick={() => ui.setOpenPanel("export")}>
        <Download />
        <span>تصدير</span>
      </Button>
    );
  const previewSlides = [
    selected[0],
    selected[Math.floor(selected.length / 2)],
    selected.at(-1),
  ].filter((slide, index, array) => slide && array.indexOf(slide) === index);
  return (
    <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mx-auto grid max-w-[1376px] gap-8 lg:grid-cols-[400px_1fr]">
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">تصدير السلسلة</h1>
            <Button
              variant="ghost"
              disabled={busy}
              onClick={() => ui.setOpenPanel("properties")}
            >
              العودة للتصميم
            </Button>
          </div>
          <fieldset disabled={busy} className="space-y-5">
            <label className="block font-semibold">
              الصيغة
              <Select
                aria-label="الصيغة"
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as typeof format)
                }
              >
                <option value="png">PNG — صور جاهزة للنشر</option>
                <option value="svg">SVG — ملفات متجهية</option>
                <option value="pdf">PDF — ملف متعدد الصفحات</option>
              </Select>
            </label>
            <label className="block font-semibold">
              الشرائح
              <Select
                aria-label="الشرائح"
                value={scope}
                onChange={(event) => setScope(event.target.value)}
              >
                <option value="all">
                  كل الشرائح ({document.slides.length})
                </option>
                <option value="current">الشريحة الحالية فقط</option>
                <option value="range">نطاق محدد</option>
              </Select>
            </label>
            {scope === "range" ? (
              <label className="block">
                نطاق الشرائح
                <Input
                  dir="ltr"
                  aria-label="نطاق الشرائح"
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                  placeholder="1-4, 8"
                />
                <span className="mt-2 block text-sm text-brand-muted">
                  مثال: 1-4, 8
                </span>
                {rangeError ? (
                  <span role="alert" className="block text-sm text-red-800">
                    {rangeError}
                  </span>
                ) : null}
              </label>
            ) : null}
            {format === "png" ? (
              <label className="block font-semibold">
                الدقة
                <Select
                  aria-label="الدقة"
                  value={scale}
                  onChange={(event) => setScale(Number(event.target.value))}
                >
                  <option value={1}>الأصلية — مناسبة للنشر</option>
                  <option value={2}>مضاعفة — ملف أكبر</option>
                </Select>
              </label>
            ) : null}
            <label className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={batches}
                onChange={(event) => setBatches(event.target.checked)}
              />
              قسّم إلى مجموعات من 20 شريحة
            </label>
            <p className="text-sm text-brand-muted">
              التقسيم اختياري للنشر. المشروع يحتفظ بكل شرائحه.
            </p>
          </fieldset>
          {issues.length ? (
            <div className="bg-[#FFF1CE] p-4 text-sm text-[#745018]">
              <p>{issues.length} ملاحظات قبل النشر.</p>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => ui.setOpenPanel("preflight")}
              >
                مراجعة الملاحظات
              </Button>
            </div>
          ) : null}
          <Button
            className="min-h-12 w-full"
            disabled={busy || !selected.length}
            onClick={() => void run("design")}
          >
            {busy ? "جارٍ التصدير…" : "تنزيل الملفات"}
          </Button>
          {busy ? (
            <div>
              <progress
                className="w-full accent-primary"
                value={completed}
                max={selected.length || 1}
                aria-label="تقدم التصدير"
              />
              <p className="my-2 text-center tabular-nums">
                {completed} / {selected.length}
              </p>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => controller.current?.abort()}
              >
                إلغاء التصدير
              </Button>
            </div>
          ) : null}
          <p role="status" className="text-sm text-brand-muted">
            {message}
          </p>
          {error ? (
            <p role="alert" className="bg-red-50 p-3 text-red-800">
              {error}
            </p>
          ) : null}
          <details className="border-t border-brand-border pt-4">
            <summary className="min-h-11 cursor-pointer font-bold">
              نسخة احتياطية وبيانات المشروع
            </summary>
            <p className="my-3 text-sm text-brand-muted">
              النسخة الاحتياطية تشمل التصميم والصور. JSON يحتوي بيانات التصميم
              فقط.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void run("backup")}
              >
                تنزيل نسخة احتياطية
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => void run("json")}
              >
                JSON بدون الصور
              </Button>
            </div>
          </details>
        </section>
        <aside className="bg-[#E9ECE5] p-4 sm:p-8">
          <h2 className="text-3xl font-bold">جاهز للسحبة الجاية.</h2>
          <div className="mt-8 grid grid-cols-3 items-start gap-3 sm:gap-6">
            {previewSlides.map((slide) =>
              slide ? (
                <div key={slide.id}>
                  <ArtworkPreview
                    document={document}
                    slide={slide}
                    assetUrls={assetUrls}
                  />
                  <p className="mt-3 text-xs sm:text-sm">
                    {String(document.slides.indexOf(slide) + 1).padStart(
                      2,
                      "0",
                    )}{" "}
                    · {slide.name}
                  </p>
                </div>
              ) : null,
            )}
          </div>
          <p className="mt-8 text-brand-muted">
            {document.name} · {selected.length} شرائح
          </p>
          <p className="mt-2 text-brand-muted" dir="ltr">
            {frame.width * (format === "png" ? scale : 1)} ×{" "}
            {frame.height * (format === "png" ? scale : 1)} px
          </p>
          <p className="mt-8 max-w-lg text-sm leading-7 text-brand-muted">
            التصدير يتم على جهازك. المشاريع والصور محلية؛ تحميل خطوط Google أو
            البحث عن صور خدمات خارجية اختيارية.
          </p>
        </aside>
      </div>
    </main>
  );
}
