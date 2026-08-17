"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import { flattenLayers, getFramePreset } from "@/core/document";
import { findLayerContext, getAbsoluteLayerBounds, type ResizeHandle } from "@/core/engine";
import { useCanvasInteractions } from "@/editor/hooks/use-canvas-interactions";
import { useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { SlideRenderer } from "@/renderer";
import { useEditorAssets } from "../workspace/editor-assets-context";
import { CanvasToolbar } from "./canvas-toolbar";

const RESIZE_HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function handlePosition(handle: ResizeHandle): CSSProperties {
  const horizontal = handle.includes("w") ? "0%" : handle.includes("e") ? "100%" : "50%";
  const vertical = handle.includes("n") ? "0%" : handle.includes("s") ? "100%" : "50%";
  return { left: horizontal, top: vertical, transform: "translate(-50%, -50%)" };
}

export function EditorCanvas() {
  const document = useProjectDocument();
  const { assetUrls } = useEditorAssets();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId);
  const selectedLayerIds = useEditorUiStore((state) => state.selectedLayerIds);
  const zoom = useEditorUiStore((state) => state.zoom);
  const showSafeArea = useEditorUiStore((state) => state.showSafeArea);
  const snapGuides = useEditorUiStore((state) => state.snapGuides);
  const clearSelection = useEditorUiStore((state) => state.clearSelection);
  const frameElementRef = useRef<HTMLDivElement | null>(null);
  const slide = document.slides.find((entry) => entry.id === activeSlideId) ?? document.slides[0]!;
  const frame = getFramePreset(document.framePresetId);
  const entries = useMemo(() => flattenLayers(slide.layers).filter(({ layer }) => layer.visible), [slide]);
  const interactions = useCanvasInteractions({ document, slide, zoom, frameElementRef });

  useEffect(() => {
    if (activeSlideId !== slide.id) useEditorUiStore.getState().setActiveSlide(slide.id);
  }, [activeSlideId, slide.id]);

  const selectedBounds = selectedLayerIds
    .map((id) => ({ id, bounds: getAbsoluteLayerBounds(slide, id), context: findLayerContext(slide.layers, id) }))
    .filter((entry) => entry.bounds && entry.context);
  const singleSelection = selectedBounds.length === 1 ? selectedBounds[0] : null;

  return (
    <main className="relative min-w-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_center,_rgba(25,69,75,0.16)_1px,_transparent_1px)] bg-[size:20px_20px]" onPointerMove={interactions.updateInteraction} onPointerUp={(event) => interactions.endInteraction(event)} onPointerCancel={(event) => interactions.endInteraction(event, true)}>
      <CanvasToolbar />
      <div className="grid min-h-full min-w-max place-items-center p-8 pt-20 sm:p-12 sm:pt-20 lg:p-20" onPointerDown={(event) => { if (event.target === event.currentTarget) clearSelection(); }}>
        <div className="relative shadow-[0_30px_90px_rgba(25,69,75,0.22)]" style={{ width: frame.width * zoom, height: frame.height * zoom }}>
          <div ref={frameElementRef} data-canvas-frame className="absolute left-0 top-0 origin-top-left select-none" dir="ltr" style={{ width: frame.width, height: frame.height, transform: `scale(${zoom})` }}>
            <SlideRenderer document={document} slide={slide} assetUrls={assetUrls} />
            {showSafeArea ? <div className="pointer-events-none absolute z-20 border-2 border-dashed border-[#6219fd]/65" style={{ left: frame.safeArea.left, top: frame.safeArea.top, right: frame.safeArea.right, bottom: frame.safeArea.bottom }} /> : null}
            {snapGuides.map((guide, index) => <div key={`${guide.axis}-${guide.value}-${index}`} className="pointer-events-none absolute z-30 bg-sky-500" style={guide.axis === "x" ? { left: guide.value, top: 0, width: 2, height: frame.height } : { top: guide.value, left: 0, height: 2, width: frame.width }} />)}
            {entries.map(({ layer }, index) => {
              const bounds = getAbsoluteLayerBounds(slide, layer.id);
              if (!bounds) return null;
              return <div key={layer.id} className="absolute z-40 cursor-move" data-hit-layer={layer.id} style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height, zIndex: 40 + index }} onPointerDown={(event) => interactions.beginMove(event, layer.id)} />;
            })}
            {selectedBounds.map(({ id, bounds }) => bounds ? <div key={id} className="pointer-events-none absolute z-[200] border-2 border-brand-accent-strong" style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }} /> : null)}
            {singleSelection?.bounds && singleSelection.context && !singleSelection.context.layer.locked && !singleSelection.context.parentLocked ? (
              <div className="pointer-events-none absolute z-[210]" style={{ left: singleSelection.bounds.x, top: singleSelection.bounds.y, width: singleSelection.bounds.width, height: singleSelection.bounds.height }}>
                {RESIZE_HANDLES.map((handle) => <button key={handle} type="button" aria-label={`تغيير الحجم ${handle}`} className="pointer-events-auto absolute size-4 rounded-full border-2 border-white bg-brand-accent-strong shadow" style={handlePosition(handle)} onPointerDown={(event) => interactions.beginResize(event, singleSelection.id, handle)} />)}
                <span className="absolute -top-9 left-1/2 h-8 w-px -translate-x-1/2 bg-brand-accent-strong" />
                <button type="button" aria-label="تدوير العنصر" className="pointer-events-auto absolute -top-12 left-1/2 size-5 -translate-x-1/2 rounded-full border-2 border-white bg-brand-accent-strong shadow" onPointerDown={(event) => interactions.beginRotate(event, singleSelection.id)} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
