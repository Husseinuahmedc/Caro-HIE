"use client";

import { useId } from "react";

import type { ImageLayer, Layer } from "@/core/document";
import { Input, Label } from "@/shared/ui";
import { NumberField, PropertiesSection, SelectField, TextField } from "./property-fields";
import type { PatchLayer } from "./types";

function ImageFileField({ onSelect }: { onSelect: (file: File) => Promise<void> }) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>ملف الصورة</Label>
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onSelect(file);
        }}
      />
    </div>
  );
}

export function ImageProperties({
  layer,
  patch,
  onSelectFile,
}: {
  layer: ImageLayer;
  patch: PatchLayer;
  onSelectFile: (file: File) => Promise<void>;
}) {
  return (
    <PropertiesSection title="الصورة">
      <ImageFileField onSelect={onSelectFile} />
      <TextField label="النص البديل" value={layer.alt} onChange={(alt) => patch({ alt } as Partial<Layer>)} />
      <SelectField label="ملاءمة الصورة" value={layer.fit} onChange={(fit) => patch({ fit } as Partial<Layer>)}>
        <option value="cover">تغطية الإطار</option>
        <option value="contain">احتواء كامل</option>
      </SelectField>
      <NumberField label="استدارة الحواف" value={layer.radius} min={0} max={500} onChange={(radius) => patch({ radius } as Partial<Layer>)} />
    </PropertiesSection>
  );
}
