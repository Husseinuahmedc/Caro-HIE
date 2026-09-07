"use client";

import type { Layer, TextLayer } from "@/core/document";
import { FontPicker } from "../../fonts/font-picker";
import {
  ColorField,
  NumberField,
  PropertiesSection,
  SelectField,
  TextAreaField,
} from "./property-fields";
import type { PatchLayer } from "./types";

export function TextProperties({ layer, patch }: { layer: TextLayer; patch: PatchLayer }) {
  return (
    <PropertiesSection title="النص">
      <TextAreaField
        label="المحتوى"
        value={layer.content}
        onChange={(content) => patch({ content } as Partial<Layer>, "تحرير النص")}
      />
      <FontPicker
        label="الخط"
        value={layer.fontFamilyId}
        onChange={(fontFamilyId) => patch({ fontFamilyId } as Partial<Layer>)}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="حجم الخط" value={layer.fontSize} min={8} max={400} onChange={(fontSize) => patch({ fontSize } as Partial<Layer>)} />
        <NumberField label="الوزن" value={layer.fontWeight} min={100} max={900} step={100} onChange={(fontWeight) => patch({ fontWeight } as Partial<Layer>)} />
        <NumberField label="ارتفاع السطر" value={layer.lineHeight} min={0.7} max={3} step={0.05} onChange={(lineHeight) => patch({ lineHeight } as Partial<Layer>)} />
        <NumberField label="تباعد الحروف" value={layer.letterSpacing} min={-20} max={100} step={0.5} onChange={(letterSpacing) => patch({ letterSpacing } as Partial<Layer>)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectField label="الاتجاه" value={layer.direction} onChange={(direction) => patch({ direction } as Partial<Layer>)}>
          <option value="rtl">من اليمين</option>
          <option value="ltr">من اليسار</option>
        </SelectField>
        <SelectField label="المحاذاة" value={layer.align} onChange={(align) => patch({ align } as Partial<Layer>)}>
          <option value="right">يمين</option>
          <option value="center">وسط</option>
          <option value="left">يسار</option>
        </SelectField>
        <SelectField label="المحاذاة العمودية" value={layer.verticalAlign} onChange={(verticalAlign) => patch({ verticalAlign } as Partial<Layer>)}>
          <option value="top">أعلى</option>
          <option value="middle">منتصف</option>
          <option value="bottom">أسفل</option>
        </SelectField>
      </div>
      <ColorField label="لون النص" value={layer.color} onChange={(color) => patch({ color } as Partial<Layer>)} />
    </PropertiesSection>
  );
}
