"use client";

import {
  ArrowDown,
  ArrowUp,
  BringToFront,
  Copy,
  Eye,
  EyeOff,
  Group,
  Lock,
  SendToBack,
  Trash2,
  Ungroup,
  Unlock,
} from "lucide-react";

import { getLayer, type Layer } from "@/core/document";
import {
  alignLayers,
  distributeLayers,
  patchLayer,
  type AlignmentMode,
  type DistributionMode,
} from "@/core/engine";
import {
  changeLayerOrder,
  duplicateOneLayer,
  groupSelection,
  removeLayers,
  toggleVisibility,
  ungroupSelection,
} from "@/editor/commands";
import { applySlideOperation } from "@/editor/commands/document-operations";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { useEditorUiStore } from "@/editor/state/editor-ui-store";
import { Button } from "@/shared/ui";
import { storeAsset } from "@/storage";
import { useEditorAssets } from "../workspace/editor-assets-context";
import { CodeProperties } from "./properties/code-properties";
import { IconProperties } from "./properties/icon-properties";
import { ImageProperties } from "./properties/image-properties";
import { NumberField, PropertiesSection, TextField } from "./properties/property-fields";
import { ShapeProperties } from "./properties/shape-properties";
import { TextProperties } from "./properties/text-properties";
import type { PatchLayer } from "./properties/types";

function EmptySelection() {
  return (
    <div className="grid min-h-56 place-items-center p-6 text-center text-sm leading-6 text-stone-500">
      اختر عنصراً من الشريحة أو من قائمة الطبقات لتعديل خصائصه.
    </div>
  );
}

function MultipleSelection({
  count,
  onAlign,
  onDistribute,
  onGroup,
}: {
  count: number;
  onAlign: (mode: AlignmentMode) => void;
  onDistribute: (mode: DistributionMode) => void;
  onGroup: () => void;
}) {
  return (
    <div className="space-y-5 p-4">
      <div>
        <h3 className="font-black">{count} عناصر محددة</h3>
        <p className="mt-1 text-xs text-stone-500">حاذِ العناصر أو وزّعها أو اجمعها كعملية واحدة.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="secondary" size="sm" onClick={() => onAlign("right")}>يمين</Button>
        <Button variant="secondary" size="sm" onClick={() => onAlign("center-x")}>وسط</Button>
        <Button variant="secondary" size="sm" onClick={() => onAlign("left")}>يسار</Button>
        <Button variant="secondary" size="sm" onClick={() => onAlign("top")}>أعلى</Button>
        <Button variant="secondary" size="sm" onClick={() => onAlign("center-y")}>منتصف</Button>
        <Button variant="secondary" size="sm" onClick={() => onAlign("bottom")}>أسفل</Button>
        <Button variant="secondary" size="sm" className="col-span-3" onClick={() => onDistribute("horizontal")}>توزيع أفقي</Button>
        <Button variant="secondary" size="sm" className="col-span-3" onClick={() => onDistribute("vertical")}>توزيع عمودي</Button>
        <Button variant="secondary" className="col-span-3" onClick={onGroup}><Group /> تجميع</Button>
      </div>
    </div>
  );
}

function LayerHeader({
  layer,
  onToggleVisibility,
  onToggleLock,
}: {
  layer: Layer;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate font-black">{layer.name}</h3>
        <span className="text-xs uppercase text-stone-400">{layer.type}</span>
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={layer.visible ? "إخفاء العنصر" : "إظهار العنصر"}
          onClick={onToggleVisibility}
        >
          {layer.visible ? <Eye /> : <EyeOff />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={layer.locked ? "فتح القفل" : "قفل العنصر"}
          onClick={onToggleLock}
        >
          {layer.locked ? <Lock /> : <Unlock />}
        </Button>
      </div>
    </div>
  );
}

function GeneralProperties({ layer, patch }: { layer: Layer; patch: PatchLayer }) {
  return (
    <PropertiesSection title="عام">
      <TextField label="اسم الطبقة" value={layer.name} onChange={(name) => patch({ name })} />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="X" value={layer.x} onChange={(x) => patch({ x })} />
        <NumberField label="Y" value={layer.y} onChange={(y) => patch({ y })} />
        <NumberField label="العرض" value={layer.width} min={1} onChange={(width) => patch({ width })} />
        <NumberField label="الارتفاع" value={layer.height} min={1} onChange={(height) => patch({ height })} />
        <NumberField label="الدوران" value={layer.rotation} min={-360} max={360} onChange={(rotation) => patch({ rotation })} />
        <NumberField label="الشفافية (0–1)" value={layer.opacity} min={0} max={1} step={0.05} onChange={(opacity) => patch({ opacity })} />
      </div>
    </PropertiesSection>
  );
}

function LayerActions({
  locked,
  onOrder,
  onDuplicate,
  onDelete,
}: {
  locked: boolean;
  onOrder: (action: "forward" | "backward" | "front" | "back") => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-1 border-t border-stone-200 pt-4">
      <Button variant="ghost" size="icon" aria-label="إلى المقدمة" title="إلى المقدمة" disabled={locked} onClick={() => onOrder("front")}><BringToFront /></Button>
      <Button variant="ghost" size="icon" aria-label="للأمام خطوة" title="للأمام خطوة" disabled={locked} onClick={() => onOrder("forward")}><ArrowUp /></Button>
      <Button variant="ghost" size="icon" aria-label="للخلف خطوة" title="للخلف خطوة" disabled={locked} onClick={() => onOrder("backward")}><ArrowDown /></Button>
      <Button variant="ghost" size="icon" aria-label="إلى الخلف بالكامل" title="إلى الخلف بالكامل" disabled={locked} onClick={() => onOrder("back")}><SendToBack /></Button>
      <Button variant="ghost" size="icon" aria-label="تكرار" onClick={onDuplicate}><Copy /></Button>
      <Button variant="destructive" size="icon" aria-label="حذف" disabled={locked} onClick={onDelete}><Trash2 /></Button>
    </div>
  );
}

export function PropertiesPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const { reloadAssets } = useEditorAssets();
  const activeSlideId = useEditorUiStore((state) => state.activeSlideId) ?? document.slides[0]?.id;
  const selectedIds = useEditorUiStore((state) => state.selectedLayerIds);
  const selectLayer = useEditorUiStore((state) => state.selectLayer);
  const clearSelection = useEditorUiStore((state) => state.clearSelection);
  const slide = document.slides.find((entry) => entry.id === activeSlideId);
  const layer = slide && selectedIds.length === 1
    ? getLayer(slide.layers, selectedIds[0] ?? "")
    : null;

  function applyOperation(operation: Parameters<typeof applySlideOperation>[2], label: string) {
    if (!slide) return;
    session.update(
      (current) => applySlideOperation(current, slide.id, operation),
      { label, kind: "layer", affectedIds: selectedIds },
    );
  }

  const patch: PatchLayer = (patchValue, label = "تعديل خصائص العنصر") => {
    if (!slide || !layer) return;
    applyOperation((currentSlide) => patchLayer(currentSlide, layer.id, patchValue), label);
  };

  if (!slide || !selectedIds.length) return <EmptySelection />;

  if (selectedIds.length > 1) {
    return (
      <MultipleSelection
        count={selectedIds.length}
        onAlign={(mode) => applyOperation(
          (current) => alignLayers(current, selectedIds, mode, document.framePresetId),
          "محاذاة عناصر",
        )}
        onDistribute={(mode) => applyOperation(
          (current) => distributeLayers(current, selectedIds, mode),
          "توزيع عناصر",
        )}
        onGroup={() => {
          const id = groupSelection(session, slide.id, selectedIds);
          if (id) selectLayer(id);
        }}
      />
    );
  }

  if (!layer) return null;

  return (
    <div className="space-y-5 p-4">
      <LayerHeader
        layer={layer}
        onToggleVisibility={() => toggleVisibility(session, slide.id, layer.id)}
        onToggleLock={() => patch({ locked: !layer.locked }, "تغيير القفل")}
      />

      {layer.locked ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          الطبقة مقفولة. افتح القفل لتعديل خصائصها.
        </p>
      ) : null}

      <fieldset disabled={layer.locked} className="space-y-5 disabled:opacity-60">
        <GeneralProperties layer={layer} patch={patch} />
        {layer.type === "text" ? <TextProperties layer={layer} patch={patch} /> : null}
        {layer.type === "code" ? <CodeProperties layer={layer} patch={patch} /> : null}
        {layer.type === "shape" ? <ShapeProperties layer={layer} patch={patch} /> : null}
        {layer.type === "icon" ? <IconProperties layer={layer} patch={patch} /> : null}
        {layer.type === "image" ? (
          <ImageProperties
            layer={layer}
            patch={patch}
            onSelectFile={async (file) => {
              const asset = await storeAsset(document.id, file, file.name);
              patch({ assetId: asset.id } as Partial<Layer>, "إضافة صورة");
              await reloadAssets();
            }}
          />
        ) : null}
        {layer.type === "group" ? (
          <PropertiesSection title="المجموعة">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                ungroupSelection(session, slide.id, layer.id);
                clearSelection();
              }}
            >
              <Ungroup /> فك المجموعة
            </Button>
          </PropertiesSection>
        ) : null}
      </fieldset>

      <LayerActions
        locked={layer.locked}
        onOrder={(action) => changeLayerOrder(session, slide.id, layer.id, action)}
        onDuplicate={() => {
          const id = duplicateOneLayer(session, slide.id, layer.id);
          if (id) selectLayer(id);
        }}
        onDelete={() => {
          removeLayers(session, slide.id, [layer.id]);
          clearSelection();
        }}
      />
    </div>
  );
}
