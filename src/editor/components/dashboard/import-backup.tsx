"use client";

import { useRef, useState } from "react";
import { Button } from "@/shared/ui";
import type { ProjectDocument } from "@/core/document";

export function ImportBackup({ onImported }: {onImported: (document: ProjectDocument) => void}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <div className="mt-4">
    <Button variant="secondary" disabled={busy} onClick={() => input.current?.click()}>{busy ? "جارٍ الاستعادة…" : "استعادة نسخة احتياطية"}</Button>
    <input ref={input} type="file" accept=".json,application/json" aria-label="ملف النسخة الاحتياطية" className="sr-only" onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = "";
      if (!file) return;
      setBusy(true); setError("");
      try {
        if (file.size > 100 * 1024 * 1024) throw new Error("حجم الملف يتجاوز 100 ميغابايت.");
        const { importProjectBackup } = await import("@/storage/recovery/project-backup");
        const document = await importProjectBackup(JSON.parse(await file.text()));
        onImported(document);
      } catch (reason) { setError(reason instanceof Error ? reason.message : "تعذر قراءة النسخة الاحتياطية."); }
      finally { setBusy(false); }
    }} />
    {error ? <p role="alert" className="mt-2 text-sm text-red-700">{error}</p> : null}
  </div>;
}
