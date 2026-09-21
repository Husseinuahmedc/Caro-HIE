"use client";

import { FormEvent, useId, useState } from "react";

import type { ImageLayer, Layer } from "@/core/document";
import { Button, Input, Label } from "@/shared/ui";
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

function ImageUrlField({ onImport }: { onImport: (value: string) => Promise<void> }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onImport(value);
      setValue("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "تعذر إضافة الصورة. حاول مجدداً.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-2" onSubmit={submit}>
      <Label htmlFor={id}>إضافة عبر رابط Unsplash</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          dir="ltr"
          type="url"
          value={value}
          placeholder="https://images.unsplash.com/..."
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={error ? `${id}-error` : undefined}
          disabled={isLoading}
        />
        <Button type="submit" variant="secondary" disabled={isLoading || !value.trim()}>
          {isLoading ? "جارٍ الجلب..." : "إضافة"}
        </Button>
      </div>
      {error ? <p id={`${id}-error`} role="alert" className="text-xs font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}

export function ImageProperties({
  layer,
  patch,
  onSelectFile,
  onImportUrl,
}: {
  layer: ImageLayer;
  patch: PatchLayer;
  onSelectFile: (file: File) => Promise<void>;
  onImportUrl: (value: string) => Promise<void>;
}) {
  return (
    <PropertiesSection title="الصورة">
      <ImageFileField onSelect={onSelectFile} />
      <ImageUrlField onImport={onImportUrl} />
      <TextField label="النص البديل" value={layer.alt} onChange={(alt) => patch({ alt } as Partial<Layer>)} />
      <SelectField label="ملاءمة الصورة" value={layer.fit} onChange={(fit) => patch({ fit } as Partial<Layer>)}>
        <option value="cover">تغطية الإطار</option>
        <option value="contain">احتواء كامل</option>
      </SelectField>
      <NumberField label="استدارة الحواف" value={layer.radius} min={0} max={500} onChange={(radius) => patch({ radius } as Partial<Layer>)} />
    </PropertiesSection>
  );
}
