"use client";

import { Check, Palette, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { applyBrandSettings, BUILT_IN_BRAND_KITS, type BrandKit } from "@/brand";
import type { BrandColors, BrandSettings } from "@/core/document";
import { useDocumentSession, useProjectDocument } from "@/editor/hooks/use-document-session";
import { createLocalBrandKit, deleteLocalBrandKit, listLocalBrandKits } from "@/storage";
import { Button, Input, Label } from "@/shared/ui";
import { FontPicker } from "../fonts/font-picker";

const COLOR_FIELDS: Array<{ key: keyof BrandColors; label: string }> = [
  { key: "background", label: "الخلفية" },
  { key: "surface", label: "السطح" },
  { key: "accent", label: "العلامة" },
  { key: "accentSoft", label: "العلامة الخفيفة" },
  { key: "text", label: "النص" },
  { key: "muted", label: "النص الهادئ" },
  { key: "codeBackground", label: "خلفية الكود" },
  { key: "codeText", label: "نص الكود" },
];

function BrandKitCard({ kit, active, onApply, onDelete }: { kit: BrandKit; active: boolean; onApply: () => void; onDelete?: () => void }) {
  return (
    <div className={`rounded-2xl border p-2 transition ${active ? "border-brand-accent bg-brand-accent-soft" : "border-stone-200"}`}>
      <button type="button" className="w-full p-2 text-right" onClick={onApply}>
        <div className="mb-3 flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl" style={{ background: kit.settings.colors.accent, color: kit.settings.colors.background }}>{active ? <Check /> : <Palette />}</span><div className="flex gap-1">{[kit.settings.colors.background, kit.settings.colors.surface, kit.settings.colors.accent, kit.settings.colors.text].map((color) => <span key={color} className="size-5 rounded-full border border-black/10" style={{ background: color }} />)}</div></div>
        <strong className="block text-sm">{kit.name}</strong><span className="mt-1 block text-xs leading-5 text-stone-500">{kit.description}</span>
      </button>
      {onDelete ? <Button type="button" variant="ghost" size="sm" className="w-full text-red-600" onClick={onDelete}><Trash2 /> حذف الهوية المحلية</Button> : null}
    </div>
  );
}

function BrandSettingsEditor({ settings, onChange }: { settings: BrandSettings; onChange: (settings: BrandSettings) => void }) {
  return (
    <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <strong className="text-sm">تخصيص الهوية الحالية</strong>
      <div className="grid grid-cols-2 gap-2">{COLOR_FIELDS.map((field) => <div key={field.key}><Label>{field.label}</Label><Input type="color" value={settings.colors[field.key]} onChange={(event) => onChange({ ...settings, colors: { ...settings.colors, [field.key]: event.target.value } })} /></div>)}</div>
      <FontPicker label="خط العناوين" value={settings.headingFontId} onChange={(headingFontId) => onChange({ ...settings, headingFontId })} />
      <FontPicker label="خط النص" value={settings.bodyFontId} onChange={(bodyFontId) => onChange({ ...settings, bodyFontId })} />
      <div><Label>استدارة البطاقات</Label><Input type="number" min={0} max={240} value={settings.radius} onChange={(event) => onChange({ ...settings, radius: Number(event.target.value) })} /></div>
    </div>
  );
}

export function BrandPanel() {
  const document = useProjectDocument();
  const session = useDocumentSession();
  const [customKits, setCustomKits] = useState<BrandKit[]>([]);
  const [kitName, setKitName] = useState("هويتي");

  useEffect(() => {
    let active = true;
    void listLocalBrandKits().then((kits) => { if (active) setCustomKits(kits); });
    return () => { active = false; };
  }, []);

  function apply(kit: BrandKit) {
    session.update((current) => applyBrandSettings(current, kit.settings, kit.id), { label: `تطبيق هوية ${kit.name}`, kind: "brand" });
  }

  function updateSettings(settings: BrandSettings) {
    session.update((current) => applyBrandSettings(current, settings, null), { label: "تخصيص الهوية", kind: "brand" });
  }

  return (
    <div className="space-y-4 p-4">
      <div><h3 className="font-black">Brand Kits</h3><p className="mt-1 text-xs leading-5 text-stone-500">هويات مضمّنة أو مخصصة، محفوظة محلياً على جهازك.</p></div>
      {[...BUILT_IN_BRAND_KITS, ...customKits].map((kit) => <BrandKitCard key={kit.id} kit={kit} active={document.brandKitId === kit.id} onApply={() => apply(kit)} onDelete={customKits.some((custom) => custom.id === kit.id) ? async () => { await deleteLocalBrandKit(kit.id); setCustomKits((current) => current.filter((item) => item.id !== kit.id)); } : undefined} />)}
      <BrandSettingsEditor settings={document.brand} onChange={updateSettings} />
      <div className="rounded-2xl border border-stone-200 p-3"><Label>اسم الهوية المحلية</Label><Input value={kitName} onChange={(event) => setKitName(event.target.value)} /><Button type="button" variant="secondary" className="mt-2 w-full" onClick={async () => { const kit = await createLocalBrandKit(kitName, "هوية محلية مخصصة", document.brand); setCustomKits((current) => [kit, ...current]); apply(kit); }}><Plus /> حفظ كـBrand Kit</Button></div>
    </div>
  );
}
