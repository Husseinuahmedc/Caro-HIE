import type { Layer } from "@/core/document";

export type PatchLayer = (patch: Partial<Layer>, label?: string) => void;
