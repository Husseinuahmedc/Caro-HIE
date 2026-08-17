import type { Layer } from "@/core/document";
import {
  deleteLayer,
  duplicateLayer,
  groupLayers,
  moveLayerToEdge,
  reorderLayer,
  toggleLayerLock,
  toggleLayerVisibility,
  ungroupLayer,
} from "@/core/engine";
import type { DocumentSession } from "../state/document-session";
import { addLayerToSlide, applySlideOperation } from "./document-operations";

export function addLayer(session: DocumentSession, slideId: string, layer: Layer): void {
  session.update((document) => addLayerToSlide(document, slideId, layer), { label: "إضافة عنصر", kind: "layer", affectedIds: [layer.id] });
}

export function removeLayers(session: DocumentSession, slideId: string, layerIds: string[]): void {
  session.update(
    (document) => layerIds.reduce((next, layerId) => applySlideOperation(next, slideId, (slide) => deleteLayer(slide, layerId)), document),
    { label: "حذف عناصر", kind: "layer", affectedIds: layerIds },
  );
}

export function duplicateOneLayer(session: DocumentSession, slideId: string, layerId: string): string | null {
  let duplicatedId: string | null = null;
  session.update((document) => {
    const slide = document.slides.find((entry) => entry.id === slideId);
    if (!slide) return document;
    const result = duplicateLayer(slide, layerId, document.framePresetId);
    duplicatedId = result.layerId;
    return result.changed ? { ...document, slides: document.slides.map((entry) => entry.id === slideId ? result.slide : entry) } : document;
  }, { label: "تكرار عنصر", kind: "layer", affectedIds: [layerId] });
  return duplicatedId;
}

export function groupSelection(session: DocumentSession, slideId: string, layerIds: string[]): string | null {
  let groupId: string | null = null;
  session.update((document) => {
    const slide = document.slides.find((entry) => entry.id === slideId);
    if (!slide) return document;
    const result = groupLayers(slide, layerIds);
    groupId = result.layerId;
    return result.changed ? { ...document, slides: document.slides.map((entry) => entry.id === slideId ? result.slide : entry) } : document;
  }, { label: "تجميع عناصر", kind: "layer", affectedIds: layerIds });
  return groupId;
}

export function ungroupSelection(session: DocumentSession, slideId: string, groupId: string): void {
  session.update((document) => applySlideOperation(document, slideId, (slide) => ungroupLayer(slide, groupId)), { label: "فك المجموعة", kind: "layer", affectedIds: [groupId] });
}

export function toggleLock(session: DocumentSession, slideId: string, layerId: string): void {
  session.update((document) => applySlideOperation(document, slideId, (slide) => toggleLayerLock(slide, layerId)), { label: "تغيير قفل العنصر", kind: "layer", affectedIds: [layerId] });
}

export function toggleVisibility(session: DocumentSession, slideId: string, layerId: string): void {
  session.update((document) => applySlideOperation(document, slideId, (slide) => toggleLayerVisibility(slide, layerId)), { label: "تغيير ظهور العنصر", kind: "layer", affectedIds: [layerId] });
}

export function changeLayerOrder(session: DocumentSession, slideId: string, layerId: string, action: "forward" | "backward" | "front" | "back"): void {
  session.update((document) => applySlideOperation(document, slideId, (slide) => action === "front" || action === "back" ? moveLayerToEdge(slide, layerId, action) : reorderLayer(slide, layerId, action)), { label: "ترتيب العنصر", kind: "layer", affectedIds: [layerId] });
}
