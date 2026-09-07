"use client";

import { useEffect } from "react";

import { useEditorUiStore } from "@/editor/state/editor-ui-store";

const MOBILE_CANVAS_GUTTER = 64;
const TABLET_EDITOR_CHROME = 416;
const DESKTOP_EDITOR_CHROME = 656;
const WIDE_EDITOR_CHROME = 752;
const DEFAULT_ZOOM = 0.55;

export function calculateInitialCanvasZoom(viewportWidth: number, frameWidth: number): number {
  const editorChrome = viewportWidth < 768
    ? MOBILE_CANVAS_GUTTER
    : viewportWidth < 1024
      ? TABLET_EDITOR_CHROME
      : viewportWidth < 1280
        ? DESKTOP_EDITOR_CHROME
        : WIDE_EDITOR_CHROME;

  const availableCanvasWidth = Math.max(0, viewportWidth - editorChrome);
  return Math.min(DEFAULT_ZOOM, Math.max(0.2, availableCanvasWidth / frameWidth));
}

export function useInitialCanvasZoom(documentId: string, frameWidth: number, frameHeight = frameWidth) {
  const setZoom = useEditorUiStore((state) => state.setZoom);

  useEffect(() => {
    const canvas = document.querySelector<HTMLElement>("[data-editor-canvas]");
    if (!canvas) return;
    const fit = () => setZoom(Math.min(1, Math.max(0.1, Math.min((canvas.clientWidth - 48) / frameWidth, (canvas.clientHeight - 136) / frameHeight))));
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);
    fit();
    return () => observer.disconnect();
  }, [documentId, frameWidth, frameHeight, setZoom]);
}
