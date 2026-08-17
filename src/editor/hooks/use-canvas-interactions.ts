"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import type { ProjectDocument, SlideDocument } from "@/core/document";
import {
  findLayerContext,
  getAbsoluteLayerBounds,
  moveLayer,
  moveSelectedLayers,
  rectangleFromResizeDelta,
  resizeLayer,
  rotateLayer,
  snapLayerPosition,
  type ResizeHandle,
} from "@/core/engine";
import { replaceSlide } from "@/editor/commands";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { useDocumentSession } from "./use-document-session";

interface BaseInteraction {
  sourceDocument: ProjectDocument;
  sourceSlide: SlideDocument;
  startClientX: number;
  startClientY: number;
  pointerId: number;
}

type CanvasInteraction =
  | (BaseInteraction & { type: "move"; layerIds: string[] })
  | (BaseInteraction & { type: "resize"; layerId: string; handle: ResizeHandle })
  | (BaseInteraction & { type: "rotate"; layerId: string; startAngle: number; sourceRotation: number });

interface CanvasInteractionOptions {
  document: ProjectDocument;
  slide: SlideDocument;
  zoom: number;
  frameElementRef: RefObject<HTMLDivElement | null>;
}

export function useCanvasInteractions({ document, slide, zoom, frameElementRef }: CanvasInteractionOptions) {
  const session = useDocumentSession();
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  const setSnapGuides = useEditorUiStore((state) => state.setSnapGuides);
  const setOpenPanel = useEditorUiStore((state) => state.setOpenPanel);
  const interactionRef = useRef<CanvasInteraction | null>(null);

  function beginMove(event: ReactPointerEvent<HTMLDivElement>, layerId: string) {
    event.stopPropagation();
    const context = findLayerContext(slide.layers, layerId);
    selectLayer(layerId, event.shiftKey);
    setOpenPanel("properties");
    if (!context || context.layer.locked || context.parentLocked) return;
    const currentSelection = useEditorUiStore.getState().selectedLayerIds;
    const layerIds = currentSelection.includes(layerId) ? currentSelection : [layerId];
    session.beginTransaction({ label: "تحريك عناصر", kind: "layer", affectedIds: layerIds });
    interactionRef.current = { type: "move", sourceDocument: document, sourceSlide: slide, startClientX: event.clientX, startClientY: event.clientY, pointerId: event.pointerId, layerIds };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function beginResize(event: ReactPointerEvent<HTMLButtonElement>, layerId: string, handle: ResizeHandle) {
    event.stopPropagation();
    session.beginTransaction({ label: "تغيير حجم عنصر", kind: "layer", affectedIds: [layerId] });
    interactionRef.current = { type: "resize", sourceDocument: document, sourceSlide: slide, startClientX: event.clientX, startClientY: event.clientY, pointerId: event.pointerId, layerId, handle };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function beginRotate(event: ReactPointerEvent<HTMLButtonElement>, layerId: string) {
    event.stopPropagation();
    const bounds = getAbsoluteLayerBounds(slide, layerId);
    const context = findLayerContext(slide.layers, layerId);
    const rect = frameElementRef.current?.getBoundingClientRect();
    if (!bounds || !context || !rect) return;
    const centerX = rect.left + (bounds.x + bounds.width / 2) * zoom;
    const centerY = rect.top + (bounds.y + bounds.height / 2) * zoom;
    session.beginTransaction({ label: "تدوير عنصر", kind: "layer", affectedIds: [layerId] });
    interactionRef.current = {
      type: "rotate",
      sourceDocument: document,
      sourceSlide: slide,
      startClientX: event.clientX,
      startClientY: event.clientY,
      pointerId: event.pointerId,
      layerId,
      startAngle: Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI,
      sourceRotation: context.layer.rotation,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateInteraction(event: ReactPointerEvent<HTMLElement>) {
    const interaction = interactionRef.current;
    if (!interaction || event.pointerId !== interaction.pointerId) return;
    const deltaX = (event.clientX - interaction.startClientX) / zoom;
    const deltaY = (event.clientY - interaction.startClientY) / zoom;
    let nextSlide = interaction.sourceSlide;
    if (interaction.type === "move") {
      if (interaction.layerIds.length > 1) {
        nextSlide = moveSelectedLayers(interaction.sourceSlide, interaction.layerIds, { x: deltaX, y: deltaY }, document.framePresetId).slide;
        setSnapGuides([]);
      } else {
        const layerId = interaction.layerIds[0];
        if (!layerId) return;
        let result = moveLayer(interaction.sourceSlide, layerId, { x: deltaX, y: deltaY }, document.framePresetId);
        if (interaction.sourceSlide.layers.some((layer) => layer.id === layerId)) {
          const moved = findLayerContext(result.slide.layers, layerId)?.layer;
          const original = findLayerContext(interaction.sourceSlide.layers, layerId)?.layer;
          if (moved && original) {
            const snapped = snapLayerPosition(moved, interaction.sourceSlide, document.framePresetId, 14 / zoom, [layerId]);
            result = moveLayer(interaction.sourceSlide, layerId, { x: snapped.x - original.x, y: snapped.y - original.y }, document.framePresetId);
            setSnapGuides(snapped.guides);
          }
        }
        nextSlide = result.slide;
      }
    } else if (interaction.type === "resize") {
      const layer = findLayerContext(interaction.sourceSlide.layers, interaction.layerId)?.layer;
      if (!layer) return;
      nextSlide = resizeLayer(interaction.sourceSlide, interaction.layerId, rectangleFromResizeDelta(layer, interaction.handle, deltaX, deltaY), document.framePresetId).slide;
    } else {
      const bounds = getAbsoluteLayerBounds(interaction.sourceSlide, interaction.layerId);
      const rect = frameElementRef.current?.getBoundingClientRect();
      if (!bounds || !rect) return;
      const centerX = rect.left + (bounds.x + bounds.width / 2) * zoom;
      const centerY = rect.top + (bounds.y + bounds.height / 2) * zoom;
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
      nextSlide = rotateLayer(interaction.sourceSlide, interaction.layerId, interaction.sourceRotation + angle - interaction.startAngle).slide;
    }
    session.replaceTransientDocument(replaceSlide(interaction.sourceDocument, nextSlide));
  }

  function endInteraction(event: ReactPointerEvent<HTMLElement>, cancel = false) {
    if (!interactionRef.current || event.pointerId !== interactionRef.current.pointerId) return;
    interactionRef.current = null;
    setSnapGuides([]);
    if (cancel) session.cancelTransaction();
    else session.commitTransaction();
  }

  return { beginMove, beginResize, beginRotate, updateInteraction, endInteraction };
}
