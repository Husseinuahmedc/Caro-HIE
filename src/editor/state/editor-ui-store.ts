import { create } from "zustand";

import type { SnapGuide } from "@/core/engine";

export type EditorPanel = "layers" | "properties" | "planner" | "brand" | "preflight" | "help" | "navigation";
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
  inspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;
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
  showSafeArea: false,
  inspectorOpen: false,
  setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
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
  setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.1, zoom)) }),
  setOpenPanel: (openPanel) => set({ openPanel }),
  setTool: (tool) => set({ tool }),
  setHoveredLayer: (hoveredLayerId) => set({ hoveredLayerId }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  toggleSafeArea: () => set((state) => ({ showSafeArea: !state.showSafeArea })),
  setSnapGuides: (snapGuides) => set({ snapGuides }),
}));
