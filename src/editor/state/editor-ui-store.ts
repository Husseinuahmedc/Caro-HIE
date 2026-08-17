import { create } from "zustand";

import type { SnapGuide } from "@/core/engine";

export type EditorPanel = "layers" | "properties" | "planner" | "brand" | "preflight";
export type EditorTool = "select" | "text" | "shape" | "image";

interface EditorUiState {
  activeSlideId: string | null;
  selectedLayerIds: string[];
  zoom: number;
  openPanel: EditorPanel;
  tool: EditorTool;
  hoveredLayerId: string | null;
  focusMode: boolean;
  showSafeArea: boolean;
  snapGuides: SnapGuide[];
  setActiveSlide: (slideId: string) => void;
  selectLayer: (layerId: string, additive?: boolean) => void;
  clearSelection: () => void;
  setZoom: (zoom: number) => void;
  setOpenPanel: (panel: EditorPanel) => void;
  setTool: (tool: EditorTool) => void;
  setHoveredLayer: (layerId: string | null) => void;
  toggleFocusMode: () => void;
  toggleSafeArea: () => void;
  setSnapGuides: (guides: SnapGuide[]) => void;
}

export const useEditorUiStore = create<EditorUiState>((set) => ({
  activeSlideId: null,
  selectedLayerIds: [],
  zoom: 0.55,
  openPanel: "properties",
  tool: "select",
  hoveredLayerId: null,
  focusMode: false,
  showSafeArea: true,
  snapGuides: [],
  setActiveSlide: (slideId) => set({ activeSlideId: slideId, selectedLayerIds: [] }),
  selectLayer: (layerId, additive = false) => set((state) => ({
    selectedLayerIds: additive
      ? state.selectedLayerIds.includes(layerId)
        ? state.selectedLayerIds.filter((id) => id !== layerId)
        : [...state.selectedLayerIds, layerId]
      : [layerId],
  })),
  clearSelection: () => set({ selectedLayerIds: [] }),
  setZoom: (zoom) => set({ zoom: Math.min(1.25, Math.max(0.2, zoom)) }),
  setOpenPanel: (openPanel) => set({ openPanel }),
  setTool: (tool) => set({ tool }),
  setHoveredLayer: (hoveredLayerId) => set({ hoveredLayerId }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  toggleSafeArea: () => set((state) => ({ showSafeArea: !state.showSafeArea })),
  setSnapGuides: (snapGuides) => set({ snapGuides }),
}));
