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
  portrait34: {
    id: "portrait34",
    label: "عمودي 3:4",
    width: 1080,
    height: 1440,
    safeArea: { top: 90, right: 72, bottom: 108, left: 72 },
  },
  custom: {
    id: "custom",
    label: "مقاس مخصص",
    width: 1080,
    height: 1350,
    safeArea: { top: 90, right: 72, bottom: 90, left: 72 },
  },
  story: {
    id: "story",
    label: "ستوري 9:16",
    width: 1080,
    height: 1920,
    safeArea: { top: 250, right: 72, bottom: 310, left: 72 },
  },
};

export function getFramePreset(
  id: FramePresetId | FramePreset,
  custom?: { width: number; height: number },
): FramePreset {
  if (typeof id !== "string") return id;
  if (id !== "custom" || !custom) return FRAME_PRESETS[id];
  const margin = Math.min(custom.width, custom.height) * 0.067;
  return {
    id,
    label: "مقاس مخصص",
    ...custom,
    safeArea: { top: margin, right: margin, bottom: margin, left: margin },
  };
}
