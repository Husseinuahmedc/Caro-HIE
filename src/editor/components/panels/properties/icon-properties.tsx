"use client";

import type { IconLayer, Layer } from "@/core/document";
import { IconPicker } from "../../icons/icon-picker";
import { ColorField, NumberField, PropertiesSection, SelectField } from "./property-fields";
import type { PatchLayer } from "./types";

export function IconProperties({ layer, patch }: { layer: IconLayer; patch: PatchLayer }) {
  return (
    <PropertiesSection title="الأيقونة">
      <IconPicker
        value={layer.icon}
        color={layer.color}
        fill={layer.fill}
        strokeWidth={layer.strokeWidth}
        onChange={(icon) => patch({ icon } as Partial<Layer>, "تغيير الأيقونة")}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="حجم الأيقونة" value={layer.fontSize} min={8} max={500} onChange={(fontSize) => patch({ fontSize } as Partial<Layer>)} />
        <NumberField label="سمك الخط" value={layer.strokeWidth} min={0.5} max={4} step={0.25} onChange={(strokeWidth) => patch({ strokeWidth } as Partial<Layer>)} />
      </div>
      <ColorField label="لون الخط" value={layer.color} onChange={(color) => patch({ color } as Partial<Layer>)} />
      <SelectField
        label="التعبئة"
        value={layer.fill === "none" ? "none" : "color"}
        onChange={(mode) => patch({ fill: mode === "none" ? "none" : layer.color } as Partial<Layer>)}
      >
        <option value="none">بدون تعبئة</option>
        <option value="color">لون مخصص</option>
      </SelectField>
      {layer.fill !== "none" ? (
        <ColorField label="لون التعبئة" value={layer.fill} onChange={(fill) => patch({ fill } as Partial<Layer>)} />
      ) : null}
    </PropertiesSection>
  );
}
