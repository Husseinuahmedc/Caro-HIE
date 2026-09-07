"use client";

import { useId } from "react";

import {
  CODE_LANGUAGE_OPTIONS,
  CODE_THEME_OPTIONS,
  type CodeLanguage,
  type CodeLayer,
  type CodeThemeId,
  type Layer,
} from "@/core/document";
import { getCodeTheme } from "@/renderer/code/code-themes";
import { Input, Label } from "@/shared/ui";
import { FontPicker } from "../../fonts/font-picker";
import {
  ColorField,
  NumberField,
  PropertiesSection,
  SelectField,
  TextAreaField,
  ToggleField,
} from "./property-fields";
import type { PatchLayer } from "./types";

function HighlightedLinesField({
  value,
  onChange,
}: {
  value: number[];
  onChange: (value: number[]) => void;
}) {
  const id = useId();
  const serialized = value.join(", ");

  function commit(input: HTMLInputElement) {
    const lines = [...new Set(
      input.value
        .split(/[,،\s]+/)
        .map(Number)
        .filter((line) => Number.isInteger(line) && line > 0 && line <= 999),
    )].sort((left, right) => left - right);
    onChange(lines);
    input.value = lines.join(", ");
  }

  return (
    <div>
      <Label htmlFor={id}>تمييز الأسطر</Label>
      <Input
        key={serialized}
        id={id}
        dir="ltr"
        defaultValue={serialized}
        placeholder="2, 4, 7"
        onBlur={(event) => commit(event.currentTarget)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
          if (event.key === "Escape") event.currentTarget.value = serialized;
        }}
      />
      <p className="mt-1.5 text-xs text-stone-400">أرقام مفصولة بفواصل، مثال: 2, 4, 7</p>
    </div>
  );
}

export function CodeProperties({ layer, patch }: { layer: CodeLayer; patch: PatchLayer }) {
  return (
    <PropertiesSection title="الكود">
      <TextAreaField
        label="الكود"
        value={layer.code}
        dir="ltr"
        className="min-h-44 font-mono text-left"
        onChange={(code) => patch({ code } as Partial<Layer>, "تحرير الكود")}
      />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="اللغة"
          value={layer.language}
          onChange={(language) => patch({ language: language as CodeLanguage } as Partial<Layer>)}
        >
          {CODE_LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
        <SelectField
          label="الثيم"
          value={layer.theme}
          onChange={(value) => {
            const theme = value as CodeThemeId;
            const colors = getCodeTheme(theme);
            patch(
              { theme, background: colors.background, color: colors.text } as Partial<Layer>,
              "تغيير ثيم الكود",
            );
          }}
        >
          {CODE_THEME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </SelectField>
      </div>
      <FontPicker
        label="خط الكود"
        value={layer.fontFamilyId}
        includeSystemMono
        onChange={(fontFamilyId) => patch({ fontFamilyId } as Partial<Layer>)}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="حجم الخط" value={layer.fontSize} min={8} max={200} onChange={(fontSize) => patch({ fontSize } as Partial<Layer>)} />
        <NumberField label="ارتفاع السطر" value={layer.lineHeight} min={0.7} max={3} step={0.05} onChange={(lineHeight) => patch({ lineHeight } as Partial<Layer>)} />
        <NumberField label="الحشو" value={layer.padding} min={0} max={240} onChange={(padding) => patch({ padding } as Partial<Layer>)} />
        <NumberField label="استدارة الحواف" value={layer.radius} min={0} max={240} onChange={(radius) => patch({ radius } as Partial<Layer>)} />
      </div>
      <ColorField label="الخلفية" value={layer.background} onChange={(background) => patch({ background } as Partial<Layer>)} />
      <ColorField label="لون النص الأساسي" value={layer.color} onChange={(color) => patch({ color } as Partial<Layer>)} />
      <ToggleField label="إظهار أرقام الأسطر" checked={layer.showLineNumbers} onChange={(showLineNumbers) => patch({ showLineNumbers } as Partial<Layer>)} />
      <HighlightedLinesField value={layer.highlightedLines} onChange={(highlightedLines) => patch({ highlightedLines } as Partial<Layer>)} />
    </PropertiesSection>
  );
}
