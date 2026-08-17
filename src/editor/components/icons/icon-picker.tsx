"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";

import type { IconName } from "@/core/document";
import { ICON_CATALOG } from "@/renderer/icons/icon-catalog";
import { IconGraphic } from "@/renderer/icons/icon-graphic";
import { Input, Label } from "@/shared/ui";

interface IconPickerProps {
  value: IconName;
  color: string;
  fill: string;
  strokeWidth: number;
  onChange: (icon: IconName) => void;
}

export function IconPicker({ value, color, fill, strokeWidth, onChange }: IconPickerProps) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("ar"));
  const filteredIcons = useMemo(() => {
    if (!deferredQuery) return ICON_CATALOG;
    return ICON_CATALOG.filter((icon) =>
      `${icon.label} ${icon.category} ${icon.keywords} ${icon.name}`
        .toLocaleLowerCase("ar")
        .includes(deferredQuery),
    );
  }, [deferredQuery]);

  return (
    <div>
      <Label htmlFor={searchId}>مكتبة الأيقونات</Label>
      <Input
        id={searchId}
        type="search"
        value={query}
        placeholder="ابحث: كود، مستخدم، سهم..."
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-brand-border bg-stone-50 p-2">
        {filteredIcons.length ? (
          <div className="grid grid-cols-4 gap-1.5">
            {filteredIcons.map((icon) => {
              const selected = icon.name === value;
              return (
                <button
                  key={icon.name}
                  type="button"
                  aria-label={icon.label}
                  aria-pressed={selected}
                  title={`${icon.label} — ${icon.category}`}
                  className={`grid min-h-16 place-items-center gap-1 rounded-xl border p-1.5 text-[10px] font-semibold transition ${
                    selected
                      ? "border-brand-accent bg-brand-accent-soft text-primary ring-2 ring-brand-accent/20"
                      : "border-transparent bg-white text-stone-600 hover:border-brand-border hover:text-primary"
                  }`}
                  onClick={() => onChange(icon.name)}
                >
                  <IconGraphic
                    name={icon.name}
                    size={25}
                    color={selected ? color : "currentColor"}
                    fill={selected ? fill : "none"}
                    strokeWidth={selected ? strokeWidth : 2}
                  />
                  <span className="line-clamp-1">{icon.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="p-5 text-center text-xs text-stone-400">لا توجد أيقونة مطابقة.</p>
        )}
      </div>
    </div>
  );
}
