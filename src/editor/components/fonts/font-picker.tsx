"use client";

import { Globe2, HardDrive } from "lucide-react";
import { useId } from "react";

import { EDITOR_FONT_REGISTRY, getEditorFont } from "@/fonts";
import { Label, Select } from "@/shared/ui";

interface FontPickerProps {
  label: string;
  value: string;
  onChange: (fontId: string) => void;
  includeSystemMono?: boolean;
}

export function FontPicker({ label, value, onChange, includeSystemMono = false }: FontPickerProps) {
  const id = useId();
  const currentFont = getEditorFont(value);
  const displayFonts = EDITOR_FONT_REGISTRY.filter((font) => font.provider === "bundled" && font.category === "display");
  const bundledFonts = EDITOR_FONT_REGISTRY.filter((font) => (font.provider === "bundled" && font.category === "core") || (includeSystemMono && font.provider === "system"));
  const googleFonts = EDITOR_FONT_REGISTRY.filter((font) => font.provider === "google");
  const sourceLabel = currentFont.provider === "google" ? "Google" : currentFont.category === "display" ? "مضاف محليًا" : "مضمّن";

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select id={id} value={value} style={{ fontFamily: currentFont.family }} onChange={(event) => onChange(event.target.value)}>
        <optgroup label="خطوط عرض مضافة">
          {displayFonts.map((font) => <option key={font.id} value={font.id}>{font.displayName}</option>)}
        </optgroup>
        <optgroup label="خطوط مضمّنة">
          {bundledFonts.map((font) => <option key={font.id} value={font.id}>{font.displayName}</option>)}
        </optgroup>
        <optgroup label="Google Fonts">
          {googleFonts.map((font) => <option key={font.id} value={font.id}>{font.displayName}</option>)}
        </optgroup>
      </Select>
      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-2.5 py-2">
        <span className="truncate text-xs text-brand-muted" style={{ fontFamily: currentFont.family }}>أبجد هوز — Aa 123</span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand-accent-strong">
          {currentFont.provider === "google" ? <Globe2 className="size-3.5" /> : <HardDrive className="size-3.5" />}
          {sourceLabel}
        </span>
      </div>
    </div>
  );
}
