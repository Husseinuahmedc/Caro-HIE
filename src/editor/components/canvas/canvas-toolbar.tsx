"use client";

import { Braces, ImageIcon, Pilcrow, Shapes, Star } from "lucide-react";

import {
  createCodeLayer,
  createIconLayer,
  createImageLayer,
  createShapeLayer,
  createTextLayer,
  type Layer,
} from "@/core/document";
import { addLayer } from "@/editor/commands";
import {
  useDocumentSession,
  useProjectDocument,
} from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";

export function CanvasToolbar() {
  const session = useDocumentSession();
  const document = useProjectDocument();
  const activeSlideId =
    useEditorUiStore((state) => state.activeSlideId) ?? document.slides[0]?.id;
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  const setOpenPanel = useEditorUiStore((state) => state.setOpenPanel);

  function insert(layer: Layer) {
    if (!activeSlideId) return;
    addLayer(session, activeSlideId, layer);
    selectLayer(layer.id);
    setOpenPanel("properties");
  }

  return (
    <div
      role="toolbar"
      aria-label="إضافة عناصر"
      className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-brand-border bg-surface-strong px-4 py-1"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="نص"
        aria-label="إضافة نص"
        onClick={() => insert(createTextLayer())}
      >
        <Pilcrow />
        <span className="hidden lg:inline">نص</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="شكل"
        aria-label="إضافة شكل"
        onClick={() => insert(createShapeLayer())}
      >
        <Shapes />
        <span className="hidden lg:inline">شكل</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="كود"
        aria-label="إضافة كود"
        onClick={() => insert(createCodeLayer())}
      >
        <Braces />
        <span className="hidden lg:inline">كود</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="أيقونة"
        aria-label="إضافة أيقونة"
        onClick={() => insert(createIconLayer())}
      >
        <Star />
        <span className="hidden lg:inline">أيقونة</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="صورة"
        aria-label="إضافة صورة"
        onClick={() => insert(createImageLayer())}
      >
        <ImageIcon />
        <span className="hidden lg:inline">صورة</span>
      </Button>
    </div>
  );
}
