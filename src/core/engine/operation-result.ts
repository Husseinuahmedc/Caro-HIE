import type { SlideDocument } from "../document";

export interface LayerOperationResult {
  slide: SlideDocument;
  changed: boolean;
}

export interface IdentifiedLayerOperationResult extends LayerOperationResult {
  layerId: string | null;
}
