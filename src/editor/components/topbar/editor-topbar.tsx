"use client";

import { ArrowRight, Focus, Grid2X2, Plus, Redo2, Save, Undo2, ZoomIn, ZoomOut } from "lucide-react";

import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import type { AutosaveStatus } from "@/editor/hooks/use-project-autosave";
import { useSlideControls } from "@/editor/hooks/use-slide-controls";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { SiteBrand } from "@/shared/site/site-brand";
import { Badge, Button, Select } from "@/shared/ui";
import { ExportActions } from "./export-actions";

const STATUS_LABELS: Record<AutosaveStatus, string> = {
  saved: "محفوظ محلياً",
  saving: "جارٍ الحفظ…",
  pending: "تغييرات غير محفوظة",
  error: "تعذر الحفظ",
};

interface EditorTopbarProps {
  status: AutosaveStatus;
  errorMessage: string | null;
  onSave: () => Promise<void>;
  onExit: () => Promise<void>;
}

export function EditorTopbar({ status, errorMessage, onSave, onExit }: EditorTopbarProps) {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const slideControls = useSlideControls();
  const zoom = useEditorUiStore((state) => state.zoom);
  const setZoom = useEditorUiStore((state) => state.setZoom);
  const toggleFocusMode = useEditorUiStore((state) => state.toggleFocusMode);
  const toggleSafeArea = useEditorUiStore((state) => state.toggleSafeArea);

  return (
    <header className="z-30 shrink-0 border-b border-brand-border bg-surface-strong shadow-[0_8px_30px_rgba(25,69,75,0.06)]">
      <div className="flex h-16 items-center gap-2 px-2 sm:px-3 lg:px-4">
        <Button type="button" variant="ghost" size="icon" aria-label="العودة إلى المشاريع" title="المشاريع" onClick={() => void onExit()}><ArrowRight /></Button>
        <SiteBrand compact className="hidden border-l border-brand-border pl-4 xl:inline-flex" />
        <div className="min-w-0 flex-1 px-2 xl:border-r xl:border-brand-border xl:pr-4">
          <strong className="block truncate text-sm text-primary">{document.name}</strong>
          <button type="button" className="text-[11px] text-brand-muted transition hover:text-primary" title={errorMessage ?? undefined} onClick={() => void onSave()}>{STATUS_LABELS[status]}</button>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          <Button type="button" variant="ghost" size="icon" aria-label="تراجع" disabled={!session.canUndo} onClick={() => session.undo()}><Undo2 /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label="إعادة" disabled={!session.canRedo} onClick={() => session.redo()}><Redo2 /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label="حفظ" onClick={() => void onSave()}><Save /></Button>
        </div>
        <div className="hidden items-center gap-1 rounded-xl border border-brand-border p-1 md:flex">
          <Button type="button" variant="ghost" size="icon" aria-label="تصغير" onClick={() => setZoom(zoom - 0.05)}><ZoomOut /></Button>
          <Badge className="min-w-14 justify-center bg-transparent tabular-nums">{Math.round(zoom * 100)}%</Badge>
          <Button type="button" variant="ghost" size="icon" aria-label="تكبير" onClick={() => setZoom(zoom + 0.05)}><ZoomIn /></Button>
        </div>
        <Button type="button" variant="ghost" size="icon" className="hidden lg:inline-flex" title="إظهار أو إخفاء المنطقة الآمنة" aria-label="المنطقة الآمنة" onClick={toggleSafeArea}><Grid2X2 /></Button>
        <Button type="button" variant="ghost" size="icon" className="hidden lg:inline-flex" title="وضع التركيز" aria-label="وضع التركيز" onClick={toggleFocusMode}><Focus /></Button>
        <ExportActions />
      </div>
      <div className="flex h-12 items-center gap-2 border-t border-brand-border px-2 lg:hidden">
        <Select aria-label="الشريحة الحالية" className="h-9 min-w-0 flex-1" value={slideControls.activeSlideId ?? ""} onChange={(event) => slideControls.setActiveSlide(event.target.value)}>
          {document.slides.map((slide, index) => <option key={slide.id} value={slide.id}>{index + 1}. {slide.name}</option>)}
        </Select>
        <Button type="button" variant="secondary" size="icon" aria-label="إضافة شريحة" disabled={!slideControls.canAdd} onClick={slideControls.add}><Plus /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="تراجع" disabled={!session.canUndo} onClick={() => session.undo()}><Undo2 /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="إعادة" disabled={!session.canRedo} onClick={() => session.redo()}><Redo2 /></Button>
      </div>
    </header>
  );
}
