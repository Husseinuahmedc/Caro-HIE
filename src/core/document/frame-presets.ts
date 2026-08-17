import type { FramePreset, FramePresetId } from "./types";

export const FRAME_PRESETS: Record<FramePresetId, FramePreset> = {
  square: {
    id: "square",
    label: "مربع 1:1",
    width: 1080,
    height: 1080,
    safeArea: { top: 72, right: 72, bottom: 72, left: 72 },
  },
  portrait: {
    id: "portrait",
    label: "عمودي 4:5",
    width: 1080,
    height: 1350,
    safeArea: { top: 90, right: 72, bottom: 108, left: 72 },
  },
  story: {
    id: "story",
    label: "ستوري 9:16",
    width: 1080,
    height: 1920,
    safeArea: { top: 250, right: 72, bottom: 310, left: 72 },
  },
};

export function getFramePreset(id: FramePresetId): FramePreset {
  return FRAME_PRESETS[id];
}
